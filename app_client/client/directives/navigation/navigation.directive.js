/*  Chris Clifford
 *  1/2019
 *
 *  /directives/navigation/navigation.directive.js
 */

( function () {

  angular
    .module( 'eveNix' )
    .directive( 'navigation', navigation );

  function navigation () {
    return {
      restrict: 'EA',
      templateUrl: '/directives/navigation/navigation.template.html'
    }
  }

} ) ();
