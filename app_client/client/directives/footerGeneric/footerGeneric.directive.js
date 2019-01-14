/*  Chris Clifford
 *  1/2019
 *
 *  /directives/footerGeneric/footerGeneric.directive.js
 */

( function () {

  function footerGeneric () {
    return {
      restrict: 'EA',
      templateUrl: '/directives/footerGeneric/footerGeneric.template.html'
    };
  }

  angular
    .module( 'eveNix' )
    .directive( 'footerGeneric', footerGeneric );

} ) ();
