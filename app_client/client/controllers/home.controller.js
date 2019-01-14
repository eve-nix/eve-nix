/* Chris Clifford
 * 1/2019
 *
 * /client/controllers/home.controller.js
 */

( function() {

  if ( window.location.pathname !== '/' ) {
    window.location.href = '/#' + window.location.pathname;
  }

  homeCtrl.$inject = [ '$scope', 'orders' ];

  function homeCtrl( $scope, orders ) {
    var vm = this;

    /* TODO
     * create service to retrieve orders from db
     */
    vm.content = [];
    vm.type_id = '2020';
    
    vm.pageHeader = {
      title: 'eve-nix',
      strapline: 'View market data for EvE Online.'
    };

    vm.showError = function( error ) {
      $scope.$apply( function() {
        vm.error = error.message;
      } );
    };

    vm.getOrders = function ( type_id ) {
      orders.ordersById( type_id )
        .then( function ( resp ) {
          vm.error_orders = resp.data.length > 0 ? '' : 'No orders found.';
          vm.orders = resp.data;
        }, function ( err ) {
          vm.error_orders = 'Sorry, something went wrong when retrieving orders';
        } );
    };

    vm.getOrders( vm.type_id );

  }

  angular
    .module( 'eveNix' )
    .controller( 'homeCtrl', homeCtrl );

} ) ();
