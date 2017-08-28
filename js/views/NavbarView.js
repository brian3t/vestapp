app.views.NavbarView = Backbone.View.extend({
    current_tab: 0,
    tagName: 'div',
    className: 'navbar-inner',
    attributes: {},
    set_current_tab: function (current_tab) {
        this.current_tab = current_tab;
    },
    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        var cur_route = Backbone.history.getFragment();
        if (cur_route === '') {
            cur_route = 'home';
        }
        this.$el.find('nav a').removeClass('active');
        this.$el.find('nav a.' + cur_route).addClass('active');
        return this;
    },
    events: {
        "click .logout": "logout"
    },
    login: function (e) {
        e.preventDefault();
        //disable the button so we can't resubmit while we wait
        $("#sign_in_btn").attr("disabled", "disabled");
        $.post(config.restUrl + 'user/login', $('#login_form').serialize(), function (resp) {
            if (resp.status === 'ok') {
                document.cookie = 'loginstring=' + $('#login_form').serialize();
                app.cur_user.set({id: resp.id, username: $('#username').val(), password: $('#password').val()});
                // app.cur_profile.set(resp.profile);
                var jqxhr = app.cur_user.fetch({
                    success: function () {
                        app.prepare_collections();
                        fapp.addNotification({title: "Success", message: "Signed in successfully", hold: 3000});
                        // app.router.dashboard();
                        if (!IS_LOCAL) {
                            // app.router.navigate('dashboard', {trigger: true});
                        } else {
                            // app.router.navigate('dashboard', {trigger: true});
                        }
                        setTimeout(fapp.closeModal, 1000);
                    }
                });

            } else {
                var message = "Wrong password";
                if (resp.message === 'Username does not exist') {
                    message = 'This username/email does not exist in our system';
                }
                $('#password').next('div.help-block').html('<ul class="list-unstyled"><li>' + message + '</li></ul>')
                    .parent('div.form-group').addClass('has-error');
                fapp.addNotification({title: "Login error", message: message, hold: 3000});
            }
        }, 'json').always(function () {
            $("#sign_in_btn").removeAttr('disabled');
        });
        return false;

    },
    logout: function (e) {
        var self = this;
        app_confirm("Are you sure you want to log out?", function (response) {
            if (response === true || response == 1) {
                app.reset_user();
                self.back();
            }
            app.utils.misc.hide_popover();
            app.is_notification_active = false;
        });
    },

    back: function (event) {
        ratchet_popover_dismiss();
        app.router.navigate('#', {trigger: true, replace: true});
    }
});
