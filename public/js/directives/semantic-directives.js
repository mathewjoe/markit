app.directive('dimmable', function () {
	return {
		restrict : 'C',
		link : function (scope, element, attrs) {
			element.dimmer({
				on : 'hover'
			})
		}
	}
})

app.directive('modal', function () {
	return {
		restrict : 'C',
		link : 	function (scope, element, attrs) {
			element.modal({
				closable : false
				// debug : true
			})
		}
	}
})

// app.directive('dropdown', function () {
// 	return {
// 		restrict : 'C',
// 		link : 	function (scope, element, attrs) {
// 			element.dropdown('set text', 'Move to folder')
// 		}
// 	}
// })