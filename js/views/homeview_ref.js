app.views.HomeView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.template());
            this.$username = this.$el.find('input#username');
            this.$password = this.$el.find('input#password');
            return this;
        },
        dom_ready: function () {
            $('#login-form').validator();
        },
        events: {
            "click #signin ": "login",
            'keydown': 'keyAction'
        },
        keyAction: function(e) {
            var code = e.keyCode || e.which;
            if(code == 13) {
                this.login();
            }
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
)
;

// app.user = new app.models.User;
// if (IS_DEBUG) {
//     window.localStorage.removeItem('user');
// }
// app.local_store_user = {};

//testing backbone localstorage
// var Model = Backbone.Model.extend({
//     urlRoot: '/tpl/fixtures.json',
//     localStorage: true
// });
// var model = new Model({});
// model.fetch({
//     success: function (model, response, options) {
//         console.log(Backbone.LocalStorage._getData('/tpl/fixtures.json'));
//     }
// });

/*
 testing
 */

// var superbapp = new app.models.Company({city:'San Diego', name:'superbappsolutions.com'});
// var brian = new app.models.User({name:'Brian', company: superbapp});
// var steve = new app.models.User({name:'Steve'});
//
// superbapp.set('user', [brian,steve]);
//
// console.log(superbapp.get('user').pluck('name'));

app.cur_user = new app.models.User({});
app.cur_profile = new app.models.Profile({});
app.cur_user.set('profile', app.cur_profile);
