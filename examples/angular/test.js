/** @sample $watch */
(function () {
    // let's assume that scope was dependency injected as the $rootScope

    var scope = $rootScope;
    scope.name = 'misko';
    scope.counter = 0;

    expect(scope.counter).toEqual(0);
    scope.$watch('name', function(newValue, oldValue) { scope.counter = scope.counter + 1; });
    expect(scope.counter).toEqual(0);

    scope.$digest();
    // no variable change
    expect(scope.counter).toEqual(0);

    scope.name = 'adam';
    scope.$digest();
    expect(scope.counter).toEqual(1);
}());