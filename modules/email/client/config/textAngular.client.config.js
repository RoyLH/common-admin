/**
 * Created by ken on 1115/2017.
 */
(function () {

  'use strict';

  angular.module('email')
        .config(textAngularConfig);

  textAngularConfig.$inject = ['$provide'];

  function textAngularConfig($provide) {
    $provide.decorator('taOptions', ['$delegate', function (taOptions) {
      taOptions.toolbar = [
                ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'bold', 'italics', 'underline', 'strikeThrough'],
                ['ul', 'ol', 'redo', 'undo', 'clear', 'justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent', 'html', 'insertImage', 'insertLink']
      ];

      return taOptions; // whatever you return will be the taOptions
    }]);

    $provide.decorator('taTools', ['$delegate', function (taTools) {
      taTools.bold.iconclass = 'glyphicon glyphicon-bold';
      taTools.italics.iconclass = 'glyphicon glyphicon-italic';
      taTools.underline.iconclass = 'glyphicon glyphicon-text-color';
      taTools.undo.iconclass = 'glyphicon glyphicon-chevron-left';
      taTools.redo.iconclass = 'glyphicon glyphicon-chevron-right';
      taTools.justifyLeft.iconclass = 'glyphicon glyphicon-align-left';
      taTools.justifyRight.iconclass = 'glyphicon glyphicon-align-right';
      taTools.justifyCenter.iconclass = 'glyphicon glyphicon-align-center';
      taTools.clear.iconclass = 'glyphicon glyphicon-ban-circle';
      taTools.insertLink.iconclass = 'glyphicon glyphicon-link';
      taTools.insertImage.iconclass = 'glyphicon glyphicon-picture';
      taTools.indent.iconclass = 'glyphicon glyphicon-indent-left';
      taTools.outdent.iconclass = 'glyphicon glyphicon-indent-right';
      taTools.html.iconclass = 'glyphicon glyphicon-transfer';
      taTools.insertImage.iconclass = 'glyphicon glyphicon-picture';


            // there is no quote icon in old font-awesome so we change to text as follows
      delete taTools.quote.iconclass;
      delete taTools.ul.iconclass;
      delete taTools.ol.iconclass;
      taTools.quote.buttontext = 'quote';
      taTools.ul.buttontext = 'UL';
      taTools.ol.buttontext = 'OL';

      return taTools;
    }]);
  }

}());
