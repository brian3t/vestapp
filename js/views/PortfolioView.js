app.views.PortfolioView = Backbone.View.extend({
        tagName: 'div',
        initialize: function () {
            this.render();
        },
        stock_list_view: {},
        render: function () {
            this.$el.html(this.template());
            return this;
        },
        events: {
        },
        dom_ready: function () {
            if (IS_LOCAL){
            }
        }
    }
);

if (IS_DEBUG) {
    window.localStorage.removeItem('cuser');
}