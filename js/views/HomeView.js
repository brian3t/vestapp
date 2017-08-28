app.views.HomeView = Backbone.View.extend({
        tagName: 'div',
        initialize: function () {
            this.render();
        },
        username: '',
        password: '',
        $username: null,
        $password: null,
        hashedPassword: '',
        hashed: true,
        remember: true,
        leaderboard_list_view: {},
        render: function () {
            this.$el.html(this.template());
            this.$username = this.$el.find('input#username');
            this.$password = this.$el.find('input#password');
            this.remember = localStorage.getItem('remember');
            if (_.isNull(this.remember)) {
                this.remember = true;
            }
            this.save_load_credential();
            return this;
        },

        events: {
            "submit #loginForm ": "login",
            "toggle": "remember_cb"
        },
        login: function () {

            var homeview_class = app.views.HomeView;
            //disable the button so we can't resubmit while we wait
            $("#submitButton", this).attr("disabled", "disabled");
            $.post(config.restUrl + 'user/login', $('#login-form').serialize(), function (resp) {
                if (resp.status === 'ok') {
                    document.cookie = 'loginstring=' + $('#login-form').serialize();
                    app.cur_user.set({id: resp.id, username: $('#username').val(), password: $('#password').val()});
                    // app.cur_profile.set(resp.profile);
                    var jqxhr = app.cur_user.fetch({
                        success: function () {
                            app.prepare_collections();
                            app.navbar_view = new app.views.NavbarView({model: app.cur_user});
                            // app.router.dashboard();
                            if (!IS_LOCAL) {
                                app.router.navigate('dashboard', {trigger: true});
                            } else {
                                app.router.navigate('offers', {trigger: true});
                                $('.edit_switch').trigger('change');
                            }
                        }
                    });

                } else {
                    var message = 'Oh nose! That password just won\'t work';
                    if (resp.message === 'Username does not exist') {
                        message = 'This email does not exist in our system';
                    }
                    $('#password').next('div.help-block').html('<ul class="list-unstyled"><li>' + message + '</li></ul>')
                        .parent('div.form-group').addClass('has-error');
                }
            }, 'json');
            return false;

        },
        remember_cb: function (e) {
            this.remember = $(e.target).hasClass('active');
            this.remember = Boolean(this.remember);
            localStorage.setItem('remember', this.remember);
            this.save_load_credential();
        },
        save_load_credential: function () {
            this.remember = Boolean(this.remember);
            if (this.remember !== true) {
                window.localStorage.setItem("password", "");
                window.localStorage.setItem("username", "");
                this.$username.val('');
                this.$password.val('');
                this.hashed = false;
            } else {
                if (!_.isEmpty(window.localStorage.getItem('username'))) {
                    this.$username.val(window.localStorage.getItem('username'));
                }
                if (!_.isEmpty(window.localStorage.getItem('password'))) {
                    this.$password.val(window.localStorage.getItem('password'));
                }

            }
        },
        dom_ready: function () {
            var remember = localStorage.getItem('remember');
            if (remember) {
                $('#remember').addClass('active');
            } else {
                $('#remember').removeClass('active');
            }
            this.leaderboard_list_view = new app.views.LeaderboardListView({model: app.models.leaderboard_collection, parent_view: self});
            app.today = moment();
            app.first_this_month = moment().startOf('month');
            var period = app.first_this_month.format('MMM-DD') + ' to ' + app.today.format('MMM-DD');

            this.$el.find('div#leaderboard_wrapper').html('<div class="text-center content-block-title" id="leaderboard_period">' + period + '</div>').append(this.leaderboard_list_view.render().el);
        }
    },
    {
        username: '',
        password: '',
        $username: '',
        $password: '',
        hashedPassword: '',
        hashed: true,
        remember: true
    }
);

app.cuser = new app.models.Cuser();
if (IS_DEBUG) {
    window.localStorage.removeItem('cuser');
}
app.local_store_cuser = {};