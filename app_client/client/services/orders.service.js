/*  Chris Clifford
 *  1/2019
 *
 *  /services/orders.service.js
 */

( function () {

  const URI = 'http://localhost:8080'

  orders.$inject = [ '$http' ];

  function orders ( $http ) {

    const ordersById = function( type_id ) {
      return $http.get( URI + '/orders/?type_id=' + type_id );
    };

    return {
      ordersById : ordersById
    };

  }

  angular
    .module( 'eveNix' )
    .service( 'orders', orders );
    
} ) ();
