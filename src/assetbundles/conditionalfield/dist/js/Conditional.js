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
    this.showOrHide = this.options.showOrHide;
    this.fieldToToggle = this.options.fieldToToggle;

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
          _this.showOrHideTheField();
        });

      });
    },
    showOrHideTheField: function () {
      var _this = this;
      $(function () {
        var valueWeHave = _this.fieldToWatch.find('[value]').first().val();

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
          default :
            // This is an exactly match
            if (valueWeHave === _this.valueToWatch) {
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
        var fieldToToggle = $('#' + _this.options.prefix + _this.fieldToToggle + '-field').first();
        if ((_this.showOrHide === 'show' && matches) || (_this.showOrHide === 'hide' && !matches)) {
          fieldToToggle.show();
        } else {
          fieldToToggle.hide();
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
