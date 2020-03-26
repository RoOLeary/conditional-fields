/**
 * Conditional Fields plugin for Craft CMS
 *
 * Conditional Field JS
 *
 * @author    Billy Fagan
 * @copyright Copyright (c) 2020 Billy Fagan
 * @link      https://billyfagan.co.uk
 * @package   ConditionalFields
 * @since     0.0.1ConditionalFieldsConditional
 */

;(function ($, window, document, undefined) {

  var pluginName = "ConditionalFieldsConditional",
    defaults = {};

  // Plugin constructor
  function Plugin(element, options) {
    this.element = element;

    this.options = $.extend({}, defaults, options);

    this.fieldToWatch = $('#' + this.options.prefix + this.options.fieldToWatch + '-field').first();
    this.valueToWatch = this.options.valueToWatch;
    this.freeTextValue = this.options.freeTextValue;
    this.showOrHide = this.options.showOrHide;
    this.fieldsToToggle = this.options.fieldsToToggle;
    this.fieldToWatchInitialContent = this.fieldToWatch.html();

    this._defaults = defaults;
    this._name = pluginName;

    this.init();

  }

  Plugin.prototype = {

    init: function (id) {
      var _this = this;

      $(function () {
        /* -- _this.options gives us access to the $jsonVars that our FieldType passed down to us */
        var options = _this.options;

        _this.showOrHideTheField();

        _this.fieldToWatch.on('change', function (changeEvent) {
          _this.fieldToWatchInitialContent = _this.fieldToWatch.html();
          _this.showOrHideTheField();
        });

        // some crafty things change the DOM but don't fire change events, so poll for any changes in this field's div
        window.setInterval(function(_this){
          if(_this.fieldToWatchInitialContent !== _this.fieldToWatch.html())
          {
            _this.fieldToWatch.change();
          }
        }, 500, _this);

      });
    },
    showOrHideTheField: function () {
      var _this = this;
      $(function () {
        var valueWeHave = _this.fieldToWatch.find('[value]').first().val();
        var valuesWeHave = _this.fieldToWatch.find('[value]').filter(function () {
          return $(this).val().length > 0;
        }).map(function () {
          return $(this).val();
        }).toArray();

        switch (_this.valueToWatch) {
          case "conditional-empty" :
            if (valueWeHave.length === 0) {
              console.log('empty match');
              _this.matchIt(true);
            } else {
              console.log('empty un-match');
              _this.matchIt(false);
            }
            break;
          case "conditional-not-empty":
            if (valueWeHave.length > 0) {
              console.log('nonempty match');
              _this.matchIt(true);
            } else {
              console.log('nonempty un-match');
              _this.matchIt(false);
            }
            break;
          case "conditional-true":
            if (valueWeHave === '1') {
              console.log('true match');
              _this.matchIt(true);
            } else {
              console.log('true un-match');
              _this.matchIt(false);
            }
            break;
          case "conditional-false":
            if (valueWeHave !== '1') {
              console.log('false match');
              _this.matchIt(true);
            } else {
              console.log('false un-match');
              _this.matchIt(false);
            }
            break;
          case "conditional-contains":
            if (valuesWeHave.indexOf(_this.freeTextValue) > -1 || valueWeHave.indexOf(_this.freeTextValue) > -1) {
              console.log('contains match');
              _this.matchIt(true);
            } else {
              console.log('contains un-match');
              _this.matchIt(false);
            }
            break;
          case "conditional-not-contains":
            if (valuesWeHave.indexOf(_this.freeTextValue) === -1 || valueWeHave.indexOf(_this.freeTextValue) === -1) {
              console.log('not-contains match');
              _this.matchIt(true);
            } else {
              console.log('not-contains un-match');
              _this.matchIt(false);
            }
            break;
          case "conditional-exactly" :
            // This is an exactly match
            if (valueWeHave === _this.freeTextValue) {
              console.log('exactly match');
              _this.matchIt(true);
            } else {
              console.log('exactly un-match');
              _this.matchIt(false);
            }
            break;
        }
      });
    },
    matchIt: function (matches) {
      _this = this;
      $(function () {

        var fieldsToToggle = _this.fieldsToToggle.map(function (thisFieldToToggle) {
          return $('#' + _this.options.prefix + thisFieldToToggle + '-field').first();
        });

        if ((_this.showOrHide === 'show' && matches) || (_this.showOrHide === 'hide' && !matches)) {
          $(fieldsToToggle).each(function () {
            $(this).show()
          });
        } else {
          $(fieldsToToggle).each(function () {
            $(this).hide()
          });
        }
      });
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName,
          new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
