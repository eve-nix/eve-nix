/*  Chris Clifford
 *  1/2019
 *
 *  /directives/pageHeader/pageHeader.directive.js
 */

( function () {

  angular
    .module( 'eveNix' )
    .directive( 'pageHeader', pageHeader );

  function pageHeader() {
    return {
      restrict: 'EA',
      scope: {
        content: '=content'
      },
      templateUrl:'/directives/pageHeader/pageHeader.template.html'
    };
  }

} ) ();
