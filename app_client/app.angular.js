/*  Chris Clifford
 *  1/2019
 *
 *  app.angular.js
 */

( function () {

  angular.module( 'eveNix', [ 'ngRoute', 'ngSanitize' ] )

  function config( $routeProvider, $locationProvider ) {

    $locationProvider.hashPrefix( '' );
    $locationProvider.html5Mode( true );

    $routeProvider
      .when( '/', { 
        //template: '<h1>test</h1>',
        templateUrl: '/views/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      } )
      .otherwise( { redirectTo: '/' } );

  }

  angular
    .module( 'eveNix' )
    .config( [ '$routeProvider', '$locationProvider', config ] );

} ) ();

