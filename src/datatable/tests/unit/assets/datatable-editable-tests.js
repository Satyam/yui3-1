YUI.add('module-tests-dteditable', function(Y) {

    var suite = new Y.Test.Suite('gallery-datatable-editable'),
        Assert = Y.Test.Assert,
        areSame = Assert.areSame,
        isFalse = Assert.isFalse,
        isTrue = Assert.isTrue,
        isNull = Assert.isNull,
        dt;

    var fireKey = function(ceditor, key, opts) {
        opts = Y.merge({keyCode: key}, opts);

        ceditor.simulate('keydown', opts);

        ceditor.simulate('keypress', opts);

        ceditor.simulate('keyup', opts);
    };

    var inputKey = function(ceditor,value,key) {
        ceditor.focus();
        ceditor.set('value',value);
        fireKey(ceditor,key);
    };
    var makeDT = function (config_arg ) {
        config_arg = config_arg || {};

        var someData = [
            {sid:10, sname:'Sneakers', sopen:0, stype:0, stock:0, sprice:59.93, shipst:'s', sdate:new Date(2009,3,11)},
            {sid:11, sname:'Varnished Cane Toads', sopen:1,  stype:10, stock:2, shipst:'u', sprice:17.49, sdate:new Date(2009,4,12)},
            {sid:12, sname:'JuJu Beans', sopen:0,  stype:20, stock:1, sprice:1.29, shipst:'s', sdate:new Date(2009,5,13)},
            {sid:13, sname:'Tent Stakes', sopen:1,  stype:30, stock:1, sprice:7.99, shipst:'n', sdate:new Date(2010,6,14)},
            {sid:14, sname:'Peanut Butter', sopen:0,  stype:40, stock:0, sprice:3.29, shipst:'e', sdate:new Date(2011,7,15)},
            {sid:15, sname:'Garbage Bags', sopen:1, stype:50,  stock:2, sprice:17.95, shipst:'r', sdate:new Date(2012,8,18)}
        ];

        // enlarge the dataset
        Y.Array.each(someData,function(d,di){
            d.sdesc = 'Description for Item ' + d.sid + ' : ' + d.sname;
        });

        var basic_config = {
            columns: [
                {key:'sid',  editable:false},
                {key:'sopen'},
                {key:'sname'},
                {key:'sdesc'},
                {key:'stype'},
                {key:'stock'},
                {key:'sprice'},
                {key:'sdate'}
            ],
            data:    someData
        };


        return new Y.DataTable(Y.merge(basic_config,config_arg)).render('#dtable');
    };

    var checkPosition = function(row, col ) {

        var td = dt.getCell([row, col]),
            ed = Y.one('.yui3-datatable-inline-input'),
            regEd = ed.get('region'),
            regTd = td.get('region');
        areSame('block', ed.ancestor().getStyle('display'), 'Editor should be visible.: [' + row + ':' + col + ']')

        areSame(Math.round(regEd.top), Math.round(regTd.top), 'tops should match: [' + row + ':' + col + ']');
        areSame(Math.round(regEd.left), Math.round(regTd.left), 'lefts should match: [' + row + ':' + col + ']');
        regTd = dt.getCell(td,[1,1]).get('region');
        areSame(Math.round(regEd.bottom), Math.round(regTd.top), 'bottom should match top of next: [' + row + ':' + col + ']');
        areSame(Math.round(regEd.right), Math.round(regTd.left), 'right edge should match left edge of next: [' + row + ':' + col + ']');
    },
    openEditorAt = function (row, col) {
        var td = dt.getCell([row, col]);
        td.simulate('click');

        isTrue(dt._openEditor.get('visible'),'cell editor col 1 should be visible: [' + row + ':' + col + ']')
        areSame(1, Y.all('.yui3-datatable-inline-input').size(),'There should be one editor: [' + row + ':' + col + ']');
        checkPosition(row, col);
    };

    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Editable : basic setup and instance',

        setUp : function () {
            // {sid: sname: sdesc: sopen:0, stype:0, stock:0, sprice:, shipst:'s', sdate: },
            dt = makeDT();
        },

        tearDown : function () {
            if(dt) {
                dt.destroy();
            }
        },

        'should be a class': function() {
            Assert.isFunction(Y.DataTable.Editable);
        },

        'should instantiate as a DT instance': function() {
            Assert.isInstanceOf( Y.DataTable, dt, 'Not an instanceof Y.DataTable');
        },

        'listeners are set' : function(){
            //areSame( 3, this.m._subscr.length, "Didn't find 3 listeners" );
        },

        'check ATTR default values' : function(){
            isFalse( dt.get('editable'), "editable default not false" );
            isNull( dt.get('defaultEditor'), "default editor not null" );
            areSame( 'dblclick', dt.get('editOpenType'), "default editOpenType not 'dblclick'" );
        },

        'check ATTR editable setting' : function(){
            isFalse( dt.get('editable'), "editable not initially false" );

            areSame( 0, dt.getCellEditors().length, "No editors initially" );

            dt.set('editable',true);
            isTrue( dt.get('editable'), "set editable to true" );
            areSame( 0, dt.getCellEditors().length, "Still no editors (no default editor set)" );

            dt.set('editable',null);
            isTrue( dt.get('editable'), "set editable to null" );

            dt.set('editable','none');
            isTrue( dt.get('editable'), "set editable to 'none'" );

            dt.set('editable',false);
            isFalse( dt.get('editable'), "set editable false" );
            areSame( 0, dt.getCellEditors().length, "No editors initially" );

        },

        'check ATTR editOpenType setting' : function(){
            isFalse( dt.get('editable'), "editable not initially false" );
            areSame( 'dblclick', dt.get('editOpenType'), "default editOpenType not dblclick" );


            dt.set('editable',true);
            isTrue( dt.get('editable'), "set editable to true" );

            areSame('dblclick', dt.get('editOpenType'), "default editOpenType not dblclick" );

            dt.set('editOpenType',null);
            isNull(dt.get('editOpenType'), "set editOpenType failed on null" );

            dt.set('editOpenType',1);
            isNull(dt.get('editOpenType'), "set editOpenType failed on 1" );

            dt.set('editOpenType','click');
            areSame( 'click', dt.get('editOpenType'), "set editOpenType to click failed" );

        },

        'check ATTR defaultEditor setting' : function(){
            isFalse( dt.get('editable'), "editable not initially false" );
            isNull(dt.get('defaultEditor'), "default defaultEditor not none" );

            dt.set('editable',true);
            areSame( 0, dt.getCellEditors().length, "No editors yet" );

            dt.set('defaultEditor',null);
            isNull( dt.get('defaultEditor'), "set defaultEditor not null" );

            dt.set('defaultEditor','inline');
            areSame( 'inline', dt.get('defaultEditor'), "set defaultEditor failed on inline" );

            areSame( 7, dt.getCellEditors().length, "setup default editors count not 7" );

            areSame(1, Y.Object.size(dt._commonEditors), "There should be only one common editor" );
            var inl = dt._commonEditors.inline;
            areSame( 'inline', inl.get('name'), "common editor 0 should be inline");

        },

        'check destructor' : function(){
            dt.set('editable',true);
            isTrue( dt.get('editable'), "set editable to true" );

            dt.destroy();
            isFalse( dt.get('editable'), "editable not false" );

            areSame(0, Y.Object.size(dt._commonEditors), "_commonEditors not {}" );
            areSame(0, Y.Object.size(dt._columnEditors), "_columnEditors not {}" );
            isNull( dt._openEditor, "_openEditor not null" );
            isNull( dt._openTd, "_openTd not null" );
            areSame(0, Y.all('.yui3-datatable-inline-input').size(),'There should be no editors left behind');

        }


    }));


    suite.add(new Y.Test.Case({
        name: 'Gallery DataTable-Editable : check public methods ~ default as inline',

        setUp : function () {
            // {sid: sname: sdesc: sopen:0, stype:0, stock:0, sprice:, shipst:'s', sdate: },
            dt = makeDT({
                defaultEditor:  'inline',
                editOpenType:   'click',
                editable:       true
            });

        },

        tearDown : function () {
            if(dt) {
                dt.destroy();
            }
        },

        'check editor counts' : function(){

            isTrue( dt.get('editable'), "set editable to true" );

            areSame(7, dt.getCellEditors().length, 'there should be 7 cell editors');

            isNull( dt.getCellEditor('sid'),'column 0 (sid) editor should be null');
            areSame( 'inline', dt.getCellEditor('sopen').get('name'),'column 1 (sopen) editor name should be inline');

        },

        'check public methods - open/hide cell editors' : function(){
            var td = dt.getCell([0,1]);

            // on column 1, open an editor, then hide it
            openEditorAt(0,1);


            dt.hideCellEditor();
            isNull(dt._openEditor,'cell editor col 1 should be closed');
            isFalse(dt.getCellEditor('sopen').get('visible'),'cell editor col 1 should be closed');

            // open column 1 again, then click another cell ... col 1 should hide, col 6 should be visible
            td.simulate('click');
            isTrue(dt._openEditor.get('visible'),'cell editor col 1 should be visible');
            var ce = dt.getCellEditor('sopen');
            isTrue(ce.get('visible'),'cell editor col 1 should be visible');

            dt.getCell([0,6]).simulate('click');
            isTrue(dt._openEditor.get('visible'),'cell editor col 6 should be visible');
            areSame(59.93, dt._openEditor.get('value'),'cell editor col 6 value should be 59.93');

            // check hideallcelleditors
            dt.hideAllCellEditors();
            isFalse(dt.getCellEditor('sdesc').get('visible'),'cell editor col 3 should be closed');
            isNull(dt._openEditor,'open editor should be null');
            isFalse(dt.getCellEditor('sprice').get('visible'),'cell editor col 3 should be closed');

            // select row 3, column 4 ... stype value=30
            dt.set('editable',false);

            dt.set('editable',true);

            var td4 = dt.getCell([3,4]);

            td4.simulate('click');
            areSame('30',td4.getHTML(),'row 3, col 4 should be "30"');
            areSame(td4.get('text'),dt._openCell.td.getHTML());

            // check getColumnXXX methods
            areSame('stype',dt.getColumnByTd(td4).key,'getColumnByTd should be sdesc');
            areSame(Y.Object.size(dt.get('columns')[4]),
                Y.Object.size(dt.getColumnByTd(td4)),'getColumnByTd should be same as columns def');
            areSame('stype',dt.getColumnNameByTd(td4),'getColumnByTd should be sdesc');


        },




        'check initial setup - inline row 0' : function(){

            // column 0 of any row is uneditable, make sure ...
            dt.getCell([0,0]).simulate('click');
            isNull(dt._openEditor,'cell editor col 0 should be null');

            // column 1 of row 0 should open ...
            dt.getCell([0,1]).simulate('click');
            Assert.isNotNull(dt._openEditor,'cell editor col 1 should be open');
            isTrue(dt._openEditor.get('visible'),'cell editor col 1 should be visible');

            areSame(0,dt._openEditor.get('value'),'initial editor value of col 1 should be 0');

            // ESC should close
            fireKey(dt._openEditor._inputNode, 27);
            isNull(dt._openEditor,'cell editor col 1 should be closed');

        },

        'check ATTR editOpenType setting' : function(){

            isTrue( dt.get('editable'), "set editable to true" );


        },
        'check navigation': function () {
            openEditorAt(0, 1);
            var ed = Y.one('.yui3-datatable-inline-input')
            fireKey(ed, 39,{ctrlKey:true});  // Ctrl-right
            checkPosition(0,2);

            fireKey(ed, 40,{ctrlKey:true});  // Ctrl-down
            checkPosition(1,2);

            fireKey(ed, 37,{ctrlKey:true});  // Ctrl-left
            checkPosition(1,1);
            fireKey(ed, 38,{ctrlKey:true});  // Ctrl-up
            checkPosition(0,1);
            fireKey(ed, 9);  // tab
            checkPosition(0,2);
            fireKey(ed, 9,{shiftKey:true});  // back-tab
            checkPosition(0,1);
        },
        'check editing': function () {
            var td =  dt.getCell([0,1]);
            td.simulate('click');
            var ed = Y.one('.yui3-datatable-inline-input');
            dt.after('celleditor:save', function (ev) {
                areSame('sopen',ev.colKey, 'ev.colKey');
                areSame(td,ev.td,'ev.td');
                areSame('inline',ev.editorName,'ev.editorName');
                areSame(0,ev.oldValue,'ev.oldValue');
                areSame('abc',ev.newValue,'ev.newValue');
            });
            dt.after('celleditor:cancel', function (ev) {
                Assert.fail('should never fire');
            });

            areSame('0', ed.get('value'), 'check input box');
            areSame('0', td.getHTML(), 'check current cell');
            areSame(0, dt.getRecord(0).get('sopen'), 'check value on record');

            inputKey(ed, 'abc', 13);
            areSame('abc', ed.get('value'), 'check changed input');

            areSame('abc', dt.getRecord(0).get('sopen'), 'record should have changed');
            areSame('abc', dt.getCell([0,1]).getHTML(), 'check cell after saving');
            areSame('none', ed.ancestor().getStyle('display') ,'editor should be hidden');
        },
        'check editing canceled via event': function () {
            var td =  dt.getCell([0,1]);
            td.simulate('click');
            var ed = Y.one('.yui3-datatable-inline-input');
            dt.on('celleditor:save', function (ev) {
                areSame('sopen',ev.colKey, 'ev.colKey');
                areSame(td,ev.td,'ev.td');
                areSame('inline',ev.editorName,'ev.editorName');
                areSame(0,ev.oldValue,'ev.oldValue');
                areSame('abc',ev.newValue,'ev.newValue');
                ev.halt();
            });
            dt.after('celleditor:cancel', function (ev) {
                Assert.fail('should never fire');
            });

            areSame('0', ed.get('value'), 'check input box');
            areSame('0', td.getHTML(), 'check current cell');
            areSame(0, dt.getRecord(0).get('sopen'), 'check value on record');

            inputKey(ed, 'abc', 13);
            areSame('abc', ed.get('value'), 'check changed input');
            areSame(0, dt.getRecord(0).get('sopen'), 'record should not have changed');
            areSame('0', dt.getCell([0,1]).getHTML(), 'check cell remains the same');
            areSame('block', ed.ancestor().getStyle('display') ,'editor should remain visible');
        },

        'check canceled editing': function () {
            var td =  dt.getCell([0,1]);
            td.simulate('click');
            var ed = Y.one('.yui3-datatable-inline-input');
            dt.after('celleditor:save', function (ev) {
                Assert.fail('should not fire');
            });
            dt.after('celleditor:cancel', function (ev) {
                areSame('sopen',ev.colKey, 'ev.colKey');
                areSame(td,ev.td,'ev.td');
                areSame('inline',ev.editorName,'ev.editorName');
                areSame(0,ev.oldValue,'ev.oldValue');
            });

            areSame('0', ed.get('value'), 'check input box');
            areSame('0', td.getHTML(), 'check current cell');
            areSame(0, dt.getRecord(0).get('sopen'), 'check value on record');

            inputKey(ed, 'abc', 27);
            areSame('abc', ed.get('value'), 'check changed input');

            areSame(0, dt.getRecord(0).get('sopen'), 'record should not have changed');
            areSame('0', dt.getCell([0,1]).getHTML(), 'check cell remains unchanged');
            areSame('none', ed.ancestor().getStyle('display') ,'editor should be hidden');
        },
        'check destructor' : function(){
            dt.set('editable',true);
            isTrue( dt.get('editable'), "set editable to true" );

            dt.destroy();
            isFalse( dt.get('editable'), "editable not false" );

            areSame(0, Y.Object.size(dt._commonEditors), "_commonEditors not {}" );
            areSame(0, Y.Object.size(dt._columnEditors), "_columnEditors not {}" );
            isNull( dt._openEditor, "_openEditor not null" );
            isNull( dt._openTd, "_openTd not null" );
            areSame(0, Y.all('.yui3-datatable-inline-input').size(),'There should be no editors left behind');

        }

    }));

    suite.add(new Y.Test.Case({
        name: "Scroll",



        setUp: function () {
            var data = [], i;

            for (i = 0; i < 100; ++i) {
                data.push({ a: i * 1000 , b: i * 1000, c: i * 1000, d: i * 1000, e: i * 1000});
            }

            dt = new Y.DataTable({
                columns: ['a','b','c','d','e'],
                data: data,
                scrollable: 'xy',
                width: '100px',
                height: '150px',
                defaultEditor:  'inline',
                editOpenType:   'click',
                editable:       true
            }).render();
        },

        tearDown: function () {
            if (dt) {
                dt.destroy();
            }
        },

        "test scroll": function () {

            // The scrolling happens asynchronously so I need to give it a chance to happen
            dt.scrollTo([0,2]);
            this.wait(function () {
                openEditorAt(0,2);
                dt.scrollTo([10,2]);
                this.wait(function () {
                    openEditorAt(8,2);
                    dt.scrollTo([10,0]);
                    this.wait(function () {
                        openEditorAt(8,0);
                    },100);
                },100);

            },100);
       }
    }));

    Y.Test.Runner.add(suite);


},'', {requires: [ 'test' ]});