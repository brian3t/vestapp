app.routers.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "drugs/:id": "drugDetails",
        "dashboard": "dashboard",
        "forgot": "forgot",
        "view_riders": "view_riders",
        "request_ride": "request_ride"
        // ,"formulary/:f_id/:drug_id/:state": "formularyDetails"
    },

    initialize: function () {
        app.slider = new PageSlider($('body'));
        app.slider.slidePageSp = (function (_super) {
            return function () {
                var previous_view = $(this.$currentPage).attr('current_view');
                var result = _super.apply(this, arguments);
                console.log("Assign class after sliding");
                var current_view = Backbone.history.getFragment() === '' ? 'home' : Backbone.history.getFragment();
                $('div.page').attr('current_view', current_view);
                if (!app.navbarView) {
                    app.navbarView = new app.views.NavbarView();
                }
                // $('.page').removeClass('whirl no-overlay traditional').append(app.navbarView.el);
                return result;
            };
        })(app.slider.slidePage);
        app.slider.slidePage = app.slider.slidePageSp;
    },
    set_class_page: function () {
        var current_view = Backbone.history.getFragment() == '' ? 'home' : Backbone.history.getFragment();
        $('div.page').attr('current_view', current_view);
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        // if (!app.homeView) {
        app.homeView = new app.views.HomeView();
        app.homeView.render();
        // } else {
        //     console.log('reusing home view');
        //     app.homeView.delegateEvents(); // delegate events when the view is recycled
        // }
        app.slider.slidePage(app.homeView.$el);
        app.homeView.dom_ready();

    },

    request_ride: function () {
        trackButton('Select rider button');
        app.Request_ride_view = new app.views.Request_ride_view();
        app.Request_ride_view.render();
        if (_.isObject(app.offer_collection)) {
            app.offer_collection.reset();
        }
        if (_.isObject(app.request)) {
            app.request.clear().set(app.request.defaults);
        }
        app.slider.slidePage(app.Request_ride_view.$el);
        app.Request_ride_view.dom_ready();
    },

    rider_wait_pickup: function () {
        app.RiderWaitPickupView = new app.views.RiderWaitPickupView();
        app.RiderWaitPickupView.render();
        app.slider.slidePage(app.RiderWaitPickupView.$el);
        app.RiderWaitPickupView.dom_ready();
    },

    view_riders: function () {
        trackButton('Select driver button');
        app.View_riders_view = new app.views.View_riders_view();
        app.View_riders_view.render();
        app.slider.slidePage(app.View_riders_view.$el);
        app.View_riders_view.dom_ready();
    },

    dashboard: function () {

        if (!app.dashboardView) {
            app.dashboardView = new app.views.DashboardView();
            app.dashboardView.render();
        } else {
            console.log('reusing dashboard view');
            app.dashboardView.model = app.cuser;
            app.dashboardView.render();
            app.dashboardView.delegateEvents(); // delegate events when the view is recycled
        }
        app.slider.slidePage(app.dashboardView.$el);
    },

    forgot: function () {
        if (!app.forgotView) {
            app.forgotView = new app.views.ForgotView();
            app.forgotView.render();
        } else {
            console.log('reusing forgot view');
            app.forgotView.delegateEvents(); // delegate events when the view is recycled
        }
        app.slider.slidePage(app.forgotView.$el);
    },

    signup: function () {
        if (!app.signupView) {
            app.signupView = new app.views.SignupView();
            app.signupView.render();
        } else {
            console.log('reusing signupView');
            app.signupView.delegateEvents(); // delegate events when the view is recycled
        }
        app.signupView.resetFields();
        app.slider.slidePage(app.signupView.$el);
    }


});