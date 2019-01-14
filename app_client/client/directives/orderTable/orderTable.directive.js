/*  Chris Clifford
 *  1/2019
 *
 *  /directives/orderTable/orderTable.directive.js
 */

( function () {

  function orderTable () {
    return {
      restrict: 'EA',
      scope: {
        content: '=content'
      },
      templateUrl:'/directives/orderTable/orderTable.template.html'
    };
  }
  
  angular
    .module( 'eveNix' )
    .directive( 'orderTable', orderTable );
} ) ();
