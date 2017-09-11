app.views.PortfolioView = Backbone.View.extend({
        tagName: 'div',
        model: {},
        initialize: function () {
            this.model = app.cur_user.get('portfolio');
            this.render();
        },
        stock_list_view: {},
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        events: {},
        dom_ready: function () {
            if (IS_LOCAL) {
            }
        }
    }
);

if (IS_DEBUG) {
    window.localStorage.removeItem('cuser');
}