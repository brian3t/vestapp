app.views.PortfolioView = Backbone.View.extend({
        tagName: 'div',
        initialize: function () {
            this.render();
        },
        stock_list_view: {},
        render: function () {
            this.$el.html(this.template());
            this.save_load_credential();
            return this;
        },

        events: {
            "toggle": "remember_cb"
        },
        remember_cb: function (e) {
            this.remember = $(e.target).hasClass('active');
            this.remember = Boolean(this.remember);
            localStorage.setItem('remember', this.remember);
        },
        dom_ready: function () {
            this.leaderboard_list_view = new app.views.LeaderboardListView({model: app.models.leaderboard_collection, parent_view: self});
            this.$el.find('div#leaderboard_wrapper').html('<div class="text-center content-block-title" id="leaderboard_period">' + period + '</div>').append(this.leaderboard_list_view.render().el);
            if (IS_LOCAL){
            }
        }
    }
);

if (IS_DEBUG) {
    window.localStorage.removeItem('cuser');
}