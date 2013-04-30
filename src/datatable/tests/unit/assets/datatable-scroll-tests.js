YUI.add('datatable-scroll-tests', function(Y) {

var suite = new Y.Test.Suite("DataTable: Scroll"),
    keys = Y.Object.keys;

suite.add(new Y.Test.Case({
    name: "lifecycle and instantiation",

    "Y.DataTable should be augmented": function () {
        Y.Assert.isTrue(
            new Y.DataTable().hasImpl(Y.DataTable.Scrollable));
    },

    "Y.DataTable.Base should not be augmented": function () {
        Y.Assert.isFalse(
            new Y.DataTable.Base().hasImpl(Y.DataTable.Scrollable));
    },

    "Y.DataTable constructor should not error": function () {
        var table = new Y.DataTable({
            columns: ['a'],
            data: [{a:1}]
        });

        Y.Assert.isInstanceOf(Y.DataTable, table);
        Y.Assert.isTrue(table.hasImpl(Y.DataTable.Scrollable));
    }
}));

suite.add(new Y.Test.Case({
    name: "scrollable attribute",

    tearDown: function () {
        if (this.table) {
            this.table.destroy();
        }
    },

    "test scrollable values": function () {
        var config = {
                columns: ['a'],
                data: [{a:1}]
            }, table;

        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('scrollable'));

        config.scrollable = false;
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('scrollable'));

        config.scrollable = true;
        table = new Y.DataTable(config);

        Y.Assert.areSame('xy', table.get('scrollable'));

        config.scrollable = 'x';
        table = new Y.DataTable(config);

        Y.Assert.areSame('x', table.get('scrollable'));

        config.scrollable = 'y';
        table = new Y.DataTable(config);

        Y.Assert.areSame('y', table.get('scrollable'));

        config.scrollable = 'xy';
        table = new Y.DataTable(config);

        Y.Assert.areSame('xy', table.get('scrollable'));

        /*
         * Commented out until #2528732 is fixed
        config.scrollable = 'ab';
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('scrollable'));

        config.scrollable = ['x', 'y'];
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('scrollable'));

        config.scrollable = { x: true };
        table = new Y.DataTable(config);

        Y.Assert.isFalse(table.get('scrollable'));
        */
    },

    "test set('scrollable')": function () {
        var table = this.table = new Y.DataTable({
            columns: ['a'],
            data: [{a:1}]
        });

        Y.Assert.isFalse(table.get('scrollable'));

        table.set('scrollable', false);
        Y.Assert.isFalse(table.get('scrollable'));

        table.set('scrollable', true);
        Y.Assert.areSame('xy', table.get('scrollable'));

        table.set('scrollable', 'x');
        Y.Assert.areSame('x', table.get('scrollable'));

        table.set('scrollable', 'y');
        Y.Assert.areSame('y', table.get('scrollable'));

        table.set('scrollable', 'xy');
        Y.Assert.areSame('xy', table.get('scrollable'));

        table.set('scrollable', ['x','y']);
        Y.Assert.areSame('xy', table.get('scrollable'));

        table.set('scrollable', { x: true });
        Y.Assert.areSame('xy', table.get('scrollable'));

        table.set('scrollable', false);
        Y.Assert.isFalse(table.get('scrollable'));
    },

    "render() with 'scrollable' unset should not include scrolling UI": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}]
            }).render(),
            boundingBox = table.get('boundingBox');

        Y.Assert.isNull(boundingBox.one('.yui3-datatable-x-scroller'),
            'Default table has X scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller'),
            'Default table has Y scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller-container'),
            'Default table has Y scroll container node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scrollbar'),
            'Default table has virtual scrollbar node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-caption-table'),
            'Default table has caption table node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scroll-columns'),
            'Default table has fixed header node');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'Default table has scrollable-x class');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'Default table has scrollable-y class');
    },

    "render() with scrollable set, but neither width/height should not render scroll UI": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                scrollable: 'x'
            }).render(),
            boundingBox = table.get('boundingBox');

        Y.Assert.isNull(boundingBox.one('.yui3-datatable-x-scroller'),
            'Default table has X scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller'),
            'Default table has Y scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller-container'),
            'Default table has Y scroll container node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scrollbar'),
            'Default table has virtual scrollbar node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-caption-table'),
            'Default table has caption table node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scroll-columns'),
            'Default table has fixed header node');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'Default table has scrollable-x class');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'Default table has scrollable-y class');

        table.destroy();

        table = this.table = new Y.DataTable({
            columns: ['a'],
            data: [{a:1}],
            scrollable: 'y'
        }).render();

        boundingBox = table.get('boundingBox');

        Y.Assert.isNull(boundingBox.one('.yui3-datatable-x-scroller'),
            'Default table has X scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller'),
            'Default table has Y scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller-container'),
            'Default table has Y scroll container node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scrollbar'),
            'Default table has virtual scrollbar node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-caption-table'),
            'Default table has caption table node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scroll-columns'),
            'Default table has fixed header node');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'Default table has scrollable-x class');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'Default table has scrollable-y class');

        table.destroy();

        table = this.table = new Y.DataTable({
            columns: ['a'],
            data: [{a:1}],
            scrollable: 'xy'
        }).render();

        boundingBox = table.get('boundingBox');

        Y.Assert.isNull(boundingBox.one('.yui3-datatable-x-scroller'),
            'Default table has X scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller'),
            'Default table has Y scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller-container'),
            'Default table has Y scroll container node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scrollbar'),
            'Default table has virtual scrollbar node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-caption-table'),
            'Default table has caption table node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scroll-columns'),
            'Default table has fixed header node');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'Default table has scrollable-x class');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'Default table has scrollable-y class');
    },

    "render() with scrollable: x + width should render x scroller": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                scrollable: 'x',
                width: '100px'
            }).render(),
            boundingBox = table.get('boundingBox');

        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-x-scroller'),
            'X scrolling table missing X scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller'),
            'X scrolling table has Y scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller-container'),
            'X scrolling table has Y scroll container node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scrollbar'),
            'X scrolling table has virtual scrollbar node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-caption-table'),
            'X scrolling table has caption table node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scroll-columns'),
            'X scrolling table has fixed header node');
        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'X scrolling table missing scrollable-x class');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'X scrolling table has scrollable-y class');
    },

    "render() with scrollable: y + height should render y scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                scrollable: 'y',
                height: '100px'
            }).render(),
            boundingBox = table.get('boundingBox');

        Y.Assert.isNull(boundingBox.one('.yui3-datatable-x-scroller'),
            'Y scrolling table has X scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller'),
            'Y scrolling table missing Y scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller-container'),
            'Y scrolling table missing Y scroll container node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scrollbar'),
            'Y scrolling table missing virtual scrollbar node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-caption-table'),
            'Y scrolling table has caption table node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scroll-columns'),
            'Y scrolling table missing fixed header node');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'Y scrolling table has scrollable-x class');
        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'Y scrolling table missing scrollable-y class');
    },

    "render() with scrollable: xy + height, width should render x and y scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                scrollable: 'xy',
                height: '100px',
                width: '100px'
            }).render(),
            boundingBox = table.get('boundingBox');

        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-x-scroller'),
            'XY scrolling table missing X scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller'),
            'XY scrolling table missing Y scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller-container'),
            'XY scrolling table missing Y scroll container node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scrollbar'),
            'XY scrolling table missing virtual scrollbar node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-caption-table'),
            'XY scrolling table has caption table node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scroll-columns'),
            'XY scrolling table missing fixed header node');
        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'XY scrolling table missing scrollable-x class');
        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'XY scrolling table missing scrollable-y class');
    },

    "set('scrollable', 'x') after render() should add x scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                width: '100px'
            }).render(),
            boundingBox = table.get('boundingBox');

        table.set('scrollable', 'x');

        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'X scrolling table missing scrollable-x class');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-x-scroller'),
            'X scrolling table missing X scroll node');
    },

    "set('scrollable', 'y') after render() should add y scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                height: '100px'
            }).render(),
            boundingBox = table.get('boundingBox');

        table.set('scrollable', 'y');

        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'Y scrolling table missing scrollable-y class');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller-container'),
            'Y scrolling table missing Y scroll container node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scroll-columns'),
            'Y scrolling table missing Y scroll fixed header node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller'),
            'Y scrolling table missing Y scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scrollbar'),
            'Y scrolling table missing virtual scrollbar node');
    },

    "set('scrollable', 'xy') after render() should add y scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                height: '100px',
                width: '100px'
            }).render(),
            boundingBox = table.get('boundingBox');

        table.set('scrollable', 'xy');

        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'XY scrolling table missing scrollable-x class');
        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'XY scrolling table missing scrollable-y class');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-x-scroller'),
            'XY scrolling table missing X scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller-container'),
            'XY scrolling table missing Y scroll container node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scroll-columns'),
            'XY scrolling table missing Y scroll fixed header node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller'),
            'XY scrolling table missing Y scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scrollbar'),
            'XY scrolling table missing virtual scrollbar node');
    },

    "set('scrollable', 'x') from 'xy' should remove y scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                height: '100px',
                width: '100px',
                scrollable: 'xy'
            }).render(),
            boundingBox = table.get('boundingBox');

        table.set('scrollable', 'x');

        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'X scrolling table missing scrollable-x class');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'X scrolling table has scrollable-y class');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-x-scroller'),
            'X scrolling table missing X scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller-container'),
            'X scrolling table has Y scroll container node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scroll-columns'),
            'X scrolling table has Y scroll fixed header node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller'),
            'X scrolling table has Y scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scrollbar'),
            'X scrolling table has virtual scrollbar node');
    },
    "set('scrollable', 'y') from 'xy' should remove x scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                height: '100px',
                width: '100px',
                scrollable: 'xy'
            }).render(),
            boundingBox = table.get('boundingBox');

        table.set('scrollable', 'y');

        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'Y scrolling table has scrollable-x class');
        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'Y scrolling table missing scrollable-y class');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-x-scroller'),
            'Y scrolling table has X scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller-container'),
            'Y scrolling table missing Y scroll container node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scroll-columns'),
            'Y scrolling table missing Y scroll fixed header node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller'),
            'Y scrolling table missing Y scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scrollbar'),
            'Y scrolling table missing virtual scrollbar node');
    },
    "set('scrollable', false) from 'x' should remove x scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                width: '100px',
                scrollable: 'x'
            }).render(),
            boundingBox = table.get('boundingBox');

        table.set('scrollable', false);

        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'Non-scrolling table has scrollable-x class');

        Y.Assert.isNull(boundingBox.one('.yui3-datatable-x-scroller'),
            'Non-scrolling table has X scroll node');
    },

    "set('scrollable', false) from 'y' should remove y scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                height: '100px',
                scrollable: 'y'
            }).render(),
            boundingBox = table.get('boundingBox');

        table.set('scrollable', false);

        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'Non-scrolling table has scrollable-y class');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller-container'),
            'Non-scrolling table has Y scroll container node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scroll-columns'),
            'Non-scrolling table has Y scroll fixed header node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller'),
            'Non-scrolling table has Y scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scrollbar'),
            'Non-scrolling table has virtual scrollbar node');
    },

    "set('scrollable', false) from 'xy' should remove x and y scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                height: '100px',
                width: '100px',
                scrollable: 'xy'
            }).render(),
            boundingBox = table.get('boundingBox');

        table.set('scrollable', false);

        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'Non-scrolling table has scrollable-x class');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'Non-scrolling table has scrollable-y class');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-x-scroller'),
            'Non-scrolling table has X scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller-container'),
            'Non-scrolling table has Y scroll container node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scroll-columns'),
            'Non-scrolling table has Y scroll fixed header node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller'),
            'Non-scrolling table has Y scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scrollbar'),
            'Non-scrolling table has virtual scrollbar node');
    },

    "set('scrollable', 'x') from 'y' should add x scroll DOM and remove y scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                height: '100px',
                width: '100px',
                scrollable: 'y'
            }).render(),
            boundingBox = table.get('boundingBox');

        table.set('scrollable', 'x');

        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'X scrolling table missing scrollable-x class');
        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'X scrolling table has scrollable-y class');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-x-scroller'),
            'X scrolling table missing X scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller-container'),
            'X scrolling table has Y scroll container node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scroll-columns'),
            'X scrolling table has Y scroll fixed header node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-y-scroller'),
            'X scrolling table has Y scroll node');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-scrollbar'),
            'X scrolling table has virtual scrollbar node');
    },

    "set('scrollable', 'y') from 'x' should add y scroll DOM and remove x scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                height: '100px',
                width: '100px',
                scrollable: 'x'
            }).render(),
            boundingBox = table.get('boundingBox');

        table.set('scrollable', 'y');

        Y.Assert.isFalse(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'Y scrolling table has scrollable-x class');
        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'Y scrolling table missing scrollable-y class');
        Y.Assert.isNull(boundingBox.one('.yui3-datatable-x-scroller'),
            'Y scrolling table has X scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller-container'),
            'Y scrolling table missing Y scroll container node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scroll-columns'),
            'Y scrolling table missing Y scroll fixed header node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller'),
            'Y scrolling table missing Y scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scrollbar'),
            'Y scrolling table missing virtual scrollbar node');
    },

    "set('scrollable', 'xy') from 'y' should add x scroll DOM outside y scroll DOM": function () {
        var table = this.table = new Y.DataTable({
                columns: ['a'],
                data: [{a:1}],
                height: '100px',
                width: '100px',
                scrollable: 'y'
            }).render(),
            boundingBox = table.get('boundingBox');

        table.set('scrollable', 'xy');

        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-x'),
            'XY scrolling table missing scrollable-x class');
        Y.Assert.isTrue(boundingBox.hasClass('yui3-datatable-scrollable-y'),
            'XY scrolling table missing scrollable-y class');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-x-scroller'),
            'XY scrolling table missing X scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller-container'),
            'XY scrolling table missing Y scroll container node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scroll-columns'),
            'XY scrolling table missing Y scroll fixed header node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-y-scroller'),
            'XY scrolling table missing Y scroll node');
        Y.Assert.isInstanceOf(Y.Node, boundingBox.one('.yui3-datatable-scrollbar'),
            'XY scrolling table missing virtual scrollbar node');
        Y.Assert.isTrue(boundingBox.one('.yui3-datatable-y-scroller-container')
            .get('parentNode').test('.yui3-datatable-x-scroller'),
            "X scroll container didn't wrap Y scroll DOM");
    }
}));

Y.Test.Runner.add(suite);

suite = new Y.Test.Suite("y scrollable");

suite.add(new Y.Test.Case({
    name: "scrollTo",

    setUp: function () {
        var data = [], i;

        for (i = 0; i < 10; ++i) {
            data.push({ a: i, b: i, c: i });
        }

        this.shortData = data.slice();

        for (; i < 100; ++i) {
            data.push({ a: i, b: i, c: i });
        }

        this.longData = data;
    },

    "": function () {
    }
}));

suite.add(new Y.Test.Case({
    name: "y scroll",

    _should: {
        ignore: {
            "virtual scrollbar syncs scrollTop with y scroller": !Y.DOM.getScrollbarWidth(),
            "test scroll lock between virtual scrollbar and y scroller": !Y.DOM.getScrollbarWidth()
        }
    },

    setUp: function () {
        var data = [], i;

        for (i = 0; i < 100; ++i) {
            data.push({ a: i });
        }

        this.table = new Y.DataTable({
            columns: ['a'],
            data: data,
            scrollable: 'y',
            height: '100px'
        }).render();
    },

    tearDown: function () {
        this.table.destroy();
    },

    "test scroll lock between virtual scrollbar and y scroller": function () {
        var test      = this,
            table     = this.table,
            scrollbar = table._scrollbarNode,
            scroller  = table._yScrollNode;

        Y.Assert.isInstanceOf(Y.Node, scrollbar);
        Y.Assert.isInstanceOf(Y.Node, scroller);

        Y.Assert.areSame(scrollbar.get('scrollTop'), scroller.get('scrollTop'));

        var handle = scrollbar.on('scroll', function () {
            handle.detach();

            test.resume(function () {
                Y.Assert.areSame(50, scroller.get('scrollTop'));

                handle = scroller.once('scroll', function () {
                    test.resume(function () {
                        Y.Assert.areSame(50, scrollbar.get('scrollTop'),
                            "scroll lock should have prevented an update of " +
                            "the scrollbar.scrollTop for 300ms");
                    });
                });

                scroller.set('scrollTop', 80);
                test.wait();
            });
        });

        scrollbar.set('scrollTop', 50);

        test.wait();
    },

    "virtual scrollbar syncs scrollTop with y scroller": function () {
        var test      = this,
            table     = this.table,
            scrollbar = table._scrollbarNode,
            scroller  = table._yScrollNode;

        Y.Assert.isInstanceOf(Y.Node, scrollbar);
        Y.Assert.isInstanceOf(Y.Node, scroller);

        Y.Assert.areSame(scrollbar.get('scrollTop'), scroller.get('scrollTop'));

        var handle = scrollbar.on('scroll', function () {
            handle.detach();

            test.resume(function () {
                Y.Assert.areSame(50, scroller.get('scrollTop'));

                // Allow the scroll lock to lapse
                Y.later(500, {}, function () {
                    scroller.set('scrollTop', 80);

                    handle = scroller.once('scroll', function () {
                        test.resume(function () {
                            Y.Assert.areSame(80, scrollbar.get('scrollTop'));
                        });
                    });
                });

                test.wait();
            });
        });

        scrollbar.set('scrollTop', 50);

        test.wait();
    },
    "are Hidden": function () {
        Y.Assert.isFalse(this.table.isHidden([0,0]), 'top cell should not be hidden');
        Y.Assert.isFalse(this.table.isHidden([1,0]), 'next down-right cell should not be hidden');
        Y.Assert.isFalse(this.table.isHidden([2,0]), 'third cell should not be totally hidden');
        Y.Assert.isTrue(this.table.isHidden([2,0], true), 'third cell should be partially hidden');
        Y.Assert.isTrue(this.table.isHidden([3,0]), 'fourth cell should be totally hidden');
        this.table.scrollTo([3,0]);
        Y.Assert.isFalse(this.table.isHidden([3,0]),'fourth cell should not be hidden after scrolling to it');
        Y.Assert.isFalse(this.table.isHidden([3,0], true),'fourth cell should not be even partially hidden after scrolling to it');
        Y.Assert.isTrue(this.table.isHidden([0,0]), 'top left cell should now be hidden');
        this.table.scrollTo([0,0]);
        Y.Assert.isFalse(this.table.isHidden([0,0]), 'top left cell should not be hidden any longer');
    }

}));

suite.add(new Y.Test.Case({
    name: "x scrollTo and isHidden",
    setUp: function () {
        var data = [], i, c, r;


        for (i = 0; i < 10; ++i) {
            r = {};
            for (c = 0; c < 7; ++c) {
                r['a' + c] = c + '-' + i;
            }
            data.push(r);
        }
        r = [];
        for (c = 0; c < 7; ++c) {
            r.push('a' + c);
        }

        this.table = new Y.DataTable({
            columns: r,
            data: data,
            scrollable: 'x',
            width: '100px'
        }).render();
    },

    tearDown: function () {
        this.table.destroy();
    },

    "locating cells or rows": function () {
        Y.Assert.areSame(this.table.getRow(2),this.table._locateTarget(2),'locating by number should return a row');
        var r = Y.all('tr').item(3);
        Y.Assert.areSame(r, this.table._locateTarget(r.get('id')),'locating by id string should return a row');
        r = this.table.getCell([3,3]);
        Y.Assert.areSame(r,this.table._locateTarget(r),'locating by Node should return node');
        r = this.table.data.item(2);

        // Note:  there is the headers row to count.
        Y.Assert.areSame(Y.all('tr').item(3),this.table._locateTarget(r.get('clientId')),'locate by clientId of model should return a row');
        Y.Assert.isNull(this.table._locateTarget(Y.one('body')),'locating element outside of table should return null');
        Y.Assert.isNull(this.table._locateTarget({}), 'passing a bad argument should return null');
    },
    "are Hidden": function () {
        Y.Assert.isFalse(this.table.isHidden([0,0]), 'top left cell should not be hidden');
        Y.Assert.isFalse(this.table.isHidden([1,1]), 'next diagonal down-right cell [1,1] should not be hidden');
        Y.Assert.isFalse(this.table.isHidden([2,2]), 'next [2,2] cell should not be totally hidden');
        Y.Assert.isTrue(this.table.isHidden([2,2], true), '[2,2] cell should be partially hidden');
        Y.Assert.isTrue(this.table.isHidden([3,3]), '[3,3] cell should be totally hidden');
        this.table.scrollTo([3,3]);
        Y.Assert.isFalse(this.table.isHidden([3,3]),'[3,3] should not be hidden after scrolling to it');
        Y.Assert.isFalse(this.table.isHidden([3,3], true),'[3,3] should not be even partially hidden after scrolling to it');
        Y.Assert.isTrue(this.table.isHidden([0,0]), 'top left cell should now be hidden');
        this.table.scrollTo([3,0]);
        Y.Assert.isFalse(this.table.isHidden([0,0]), 'top left cell should not be hidden any longer');
        Y.Assert.isNull(this.table.isHidden([999,999]),'non existing cell should fail');
    }
}));
suite.add(new Y.Test.Case({
    name: "xy scrollTo and isHidden",
    setUp: function () {
        var data = [], i, c, r;


        for (i = 0; i < 10; ++i) {
            r = {};
            for (c = 0; c < 7; ++c) {
                r['a' + c] = c + '-' + i;
            }
            data.push(r);
        }
        r = [];
        for (c = 0; c < 7; ++c) {
            r.push('a' + c);
        }

        this.table = new Y.DataTable({
            columns: r,
            data: data,
            scrollable: 'xy',
            width: '100px',
            height: '100px'
        }).render();
    },

    tearDown: function () {
        this.table.destroy();
    },


    "are Hidden on x": function () {
        Y.Assert.isFalse(this.table.isHidden([0,0]), 'top left cell should not be hidden');
        Y.Assert.isFalse(this.table.isHidden([0,1]), 'next [0,1] cell should not be totally hidden');
        Y.Assert.isTrue(this.table.isHidden([0,1], true), '[0,1] cell should be partially hidden');
        Y.Assert.isTrue(this.table.isHidden([0,2]), '[0,2] cell should be totally hidden');
        this.table.scrollTo([0,3]);
        Y.log('The scrollTo method doesn\'t fully show the cell under the vertical scroll bar when there is one.\n' +
                'A couple of conditions have been commented out because of this', 'info','TestRunner');
        //Y.Assert.isFalse(this.table.isHidden([0,3]),'[0,3] should not be hidden after scrolling to it');
        // Y.Assert.isFalse(this.table.isHidden([0,3], true),'[0,3] should not be even partially hidden after scrolling to it');

        Y.Assert.isFalse(this.table.isHidden([0,2],true), '[0,2] should not be hidden');
        Y.Assert.isTrue(this.table.isHidden([0,0]), 'top left cell should now be hidden');
        this.table.scrollTo([0,0]);
        Y.Assert.isFalse(this.table.isHidden([0,0]), 'top left cell should not be hidden any longer');
    },
    "are Hidden on y": function () {
        Y.Assert.isFalse(this.table.isHidden([0,0]), 'top left cell should not be hidden');
        Y.Assert.isFalse(this.table.isHidden([1,0]), 'next [1,0] cell should not be totally hidden');
        Y.Assert.isTrue(this.table.isHidden([2,0], true), '[1,0] cell should be partially hidden');
        Y.Assert.isTrue(this.table.isHidden([3,0], true), '[1,0] cell should be partially hidden');
        Y.Assert.isTrue(this.table.isHidden([3,0]), '[2,0] cell should be totally hidden');
        this.table.scrollTo([3,0]);
        Y.Assert.isFalse(this.table.isHidden([3,0]),'[3,0] should not be hidden after scrolling to it');
         Y.Assert.isFalse(this.table.isHidden([3,0], true),'[3,0] should not be even partially hidden after scrolling to it');

        Y.Assert.isFalse(this.table.isHidden([2,0],true), '[2,0] should not be hidden');
        Y.Assert.isTrue(this.table.isHidden([0,0]), 'top left cell should now be hidden');
        this.table.scrollTo([0,0]);
        Y.Assert.isFalse(this.table.isHidden([0,0]), 'top left cell should not be hidden any longer');
    }

}));


Y.Test.Runner.add(suite);


}, '@VERSION@' ,{requires:['datatable-scroll', 'test', 'node-screen']});
