app.views.NavbarView = Backbone.View.extend({
    current_tab: 0,
    tagName: 'div',
    className:'navbar-inner',
    attributes:{
    },
    set_current_tab: function (current_tab) {
        this.current_tab = current_tab;
    },
    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        var cur_route = Backbone.history.getFragment();
        if (cur_route === ''){
            cur_route = 'home';
        }
        this.$el.find('nav a').removeClass('active');
        this.$el.find('nav a.' + cur_route).addClass('active');
        return this;
    },

    events: {
        "click .logout": "logout"
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
