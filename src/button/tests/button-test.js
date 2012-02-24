YUI.add('button-test', function (Y) {

var Assert      = Y.Assert,
    ArrayAssert = Y.ArrayAssert,
    suite;

// -- Suite --------------------------------------------------------------------
suite = new Y.Test.Suite('Buttons');


// -- Widget ----------------------------------------------------------------
suite.add(new Y.Test.Case({
    name: 'button widget',

    setUp : function () {
        Y.one("#container").setContent('<button id="testButton">Hello</button><button id="testToggleButton">Hello</button>');
        this.button = new Y.Button({
            srcNode: '#testButton'
        }).render();
        this.toggleButton = new Y.ToggleButton({
            srcNode: '#testToggleButton'
        }).render();
    },
    
    tearDown: function () {
        delete this.button;
        delete this.toggleButton;
    },

    'Changing the label atrribute should trigger labelChange': function () {
        var button = this.button;
        var eventsTriggered = 0;
        
        button.on('labelChange', function(){
            eventsTriggered+=1;
        });
        
        Assert.areEqual(0, eventsTriggered);
        
        button.set('label', 'foobar');
        Assert.areEqual(1, eventsTriggered);
    },
    
    'ToggleButton should have `toggle` role': function () {
        var button = this.button;
        var toggleButton = this.toggleButton;
        
        var role = toggleButton.get('contentBox').get('role');
        Assert.areEqual('toggle', role);
    },
    
    'Selecting a toggleButton should have add class `yui3-button-selected`': function () {
        var button = this.button;
        var toggleButton = this.toggleButton;
        var cb = toggleButton.get('contentBox');
        
        Assert.isFalse(cb.hasClass('yui3-button-selected'));
        
        toggleButton.select();
        Assert.isTrue(cb.hasClass('yui3-button-selected'));

        // Simulate the button click
        cb.simulate('click');
        Assert.isFalse(cb.hasClass('yui3-button-selected'));

        cb.simulate('click');
        Assert.isTrue(cb.hasClass('yui3-button-selected'));
        
        toggleButton.unselect();
        Assert.isFalse(cb.hasClass('yui3-button-selected'));
    },
    
    'Select toggling a button should fire selectedChange': function () {
        var toggleButton = this.toggleButton;
        var cb = toggleButton.get('contentBox');
        var eventsTriggered = 0;
        
        toggleButton.on('selectedChange', function(){
            eventsTriggered+=1;
        });
        
        Assert.areEqual(0, eventsTriggered);
        
        toggleButton.select();
        Assert.areEqual(1, eventsTriggered);
        
        cb.simulate('click');
        Assert.areEqual(2, eventsTriggered);
    },
    
    'disable() should set the disabled attribute to true': function () {
        var button = this.button;
        
        Assert.isFalse(button.get('disabled'));

        button.disable();
        Assert.isTrue(button.get('disabled'));
    },
    
    'enable() should set the disabled attribute to false': function () {
        var button = this.button;
        
        Assert.isFalse(button.get('disabled'));

        button.disable();
        Assert.isTrue(button.get('disabled'));
        
        button.enable();
        Assert.isFalse(button.get('disabled'));
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['button', 'test', 'node-event-simulate']
});
