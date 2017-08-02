app.views.LeaderboardListView = Backbone.View.extend({
        model: {},
        initialize: function () {
            var self = this;
            this.model = app.models.leaderboard_collection;
            this.listenTo(this.model, 'sync ', this.render);
        },
        tagName: 'ul',
        id: 'leaderboard_ul',
        parentView: null,
        render: function () {
            this.$el.html(this.template({models: this.model.models}));
            app.today = moment();
            app.first_this_month = moment().startOf('month');
            return this;
        },

        events: {
            "submit #loginForm ": "login",
            "toggle": "remember_cb"
        },
        dom_ready: function () {
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
