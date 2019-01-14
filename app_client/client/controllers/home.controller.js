/* Chris Clifford
 * 1/2019
 *
 * /client/controllers/home.controller.js
 */

( function() {

  if ( window.location.pathname !== '/' ) {
    window.location.href = '/#' + window.location.pathname;
  }

  homeCtrl.$inject = [ '$scope' ];

  function homeCtrl( $scope ) {
    var vm = this;
    
    vm.pageHeader = {
      title: 'eve-nix',
      strapline: 'View market data for EvE Online.'
    };

    vm.showError = function( error ) {
      $scope.$apply( function() {
        vm.error = error.message;
      } );
    }

  }

  angular
    .module( 'eveNix' )
    .controller( 'homeCtrl', homeCtrl );

} ) ();
