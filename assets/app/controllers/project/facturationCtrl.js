app.controller('facturationCtrl', ['$rootScope', '$scope', 'loggedUser', 'subProject', 'paymentMethods', 'billingService', 'subProjectService', 'paymentMethodService', 'moment', 'project', 'notificationService', '$window', '$state', 'numberToWordsService',function ($rootScope, $scope, loggedUser, subProject, paymentMethods, billingService, subProjectService, paymentMethodService, moment, project, notificationService, $window, $state, numberToWordsService) {

	$scope.subProject = subProject.data;
	$scope.project = project.data;
	$scope.paymentMethods = paymentMethods.data.pms;
	$scope.elementSelected = true;
	$scope.isGeneretingBill = false;
	$scope.isGeneretingInvoice = false;
	$scope.genIndex = null;
	$scope.selectedPaymentMethods = [];
	$scope.totalPayed = _calculateTotalPayed();
	$scope.totalNotPayed = _calculateTotalNotPayed();
	$scope.totalBilled = _calculateTotalBilled();
	$scope.totalNotBilled = _calculateTotalNotBilled();

	$scope.calculateAmount = function (percentage) {
		return 0.01 * percentage * $scope.subProject.budget;
	};

	$scope.calculateBillAmount = function () {
		var amount = 0;
		angular.forEach($scope.selectedPaymentMethods, function (pm, index) {
			amount += 0.01 * pm.percentage * $scope.subProject.budget;
		});
		return amount;
	};

	$scope.checkSelected = function () {
		$scope.elementSelected = true;
		$scope.selectedPaymentMethods = [];
		angular.forEach($scope.paymentMethods, function (pm, index) {
			if (pm.isSelected) {
				$scope.elementSelected = false;
				$scope.selectedPaymentMethods.push(pm)
			}
		});
	};

	$scope.calculateTotalHt = function () {
		var total = 0;
		angular.forEach($scope.paymentMethods, function (pm, index) {
			total += (0.01 * pm.percentage * $scope.subProject.budget);
		});
		return total;
	};

	$scope.calculateTotalTTC = function () {
		return $scope.subProject.budget + $scope.taxeAmount()
	};


	$scope.calculateTotalUnpayed = function () {
		return $scope.calculateTotalTTC() - _calculateTotalPayed();
	};

	$scope.taxeAmount = function () {
		return $scope.subProject.budget * 0.2;
	};

	$rootScope.$on('checkBoxChecked', function () {
		$scope.checkSelected()
	});

	$scope.generateBill = function () {
		$scope.isGeneretingBill = true;
		billingService.create({
			paymentMethods: $scope.selectedPaymentMethods,
			subProject: $scope.subProject.id,
			project: $scope.subProject.project.ref,
			amount: $scope.calculateBillAmount()
		}, function (result) {
			$scope.refreshData();
			$scope.isGeneretingBill = false;
			$scope.totalPayed = _calculateTotalPayed();
			$scope.totalNotPayed = _calculateTotalNotPayed();
			$scope.totalBilled = _calculateTotalBilled();
			$scope.totalNotBilled = _calculateTotalNotBilled();
		});
	};

	$scope.generateInvoice = function (bill, index) {
		$scope.genIndex = index;
		$scope.isGeneretingInvoice = true;
		billingService.generateInvoice({
            projectRef: $scope.project.ref,
            projectName: $scope.project.name,
			billId: bill.id,
			factureRef: bill.title,
			factureDate: moment(bill.createdAt).format("DD/MM/YYYY"),
			customerCompany: $scope.project.customer.company,
			customerAddress: $scope.project.customer.address,
			pms: _billPms(bill),
			amountHT: bill.amount,
			taxe: _billTaxe(bill),
			amountTTC: _billAmountTTC(bill),
            amountInWords: numberToWordsService.convert(_billAmountTTC(bill))
		}, function (file) {
			notificationService.notify({
				title: 'Facture générée',
				text: 'Facture générée avec succès',
				icon: 'fa fa-list-alt',
				type: 'success',
				animate_speed: 'fast'
			});
			$window.open(file.webPath);
			$scope.isGeneretingInvoice = false;
			$scope.genIndex = null;
			$scope.totalPayed = _calculateTotalPayed();
			$scope.totalNotPayed = _calculateTotalNotPayed();
			$scope.totalBilled = _calculateTotalBilled();
			$scope.totalNotBilled = _calculateTotalNotBilled();
		});
	};

	$scope.refreshData = function () {
		paymentMethodService.getBySubProject($scope.subProject.id, function (result) {
			$scope.paymentMethods = result.pms;
			$scope.subProject = result.subproject;
			$scope.totalPayed = _calculateTotalPayed();
			$scope.totalNotPayed = _calculateTotalNotPayed();
			$scope.totalBilled = _calculateTotalBilled();
			$scope.totalNotBilled = _calculateTotalNotBilled();
		})
	};

	$scope.isInvoiceGenerating = function (index) {
		if ($scope.genIndex == index) {
			return true;
		} else {
			return false
		}
	};

	$scope.setBillPayed = function (bill) {
		billingService.setPayed({
			id: bill.id,
			subProject: $scope.subProject.id
		}, function (data) {
			$scope.paymentMethods = data.pms;
			$scope.subProject = data.subProject;
			$scope.totalPayed = _calculateTotalPayed();
			$scope.totalNotPayed = _calculateTotalNotPayed();
			$scope.totalBilled = _calculateTotalBilled();
			$scope.totalNotBilled = _calculateTotalNotBilled();
			//$state.reload();
		})
	};

	$scope.setBillNotPayed = function (bill) {
		billingService.setNotPayed({
			id: bill.id,
			subProject: $scope.subProject.id
		}, function (data) {
			$scope.paymentMethods = data.pms;
			$scope.subProject = data.subProject;
			$scope.totalPayed = _calculateTotalPayed();
			$scope.totalNotPayed = _calculateTotalNotPayed();
			$scope.totalBilled = _calculateTotalBilled();
			$scope.totalNotBilled = _calculateTotalNotBilled();
		})

	};

	function _billTaxe(bill) {
		return bill.amount * 0.2;
	}

	function _billAmountTTC(bill) {
		return bill.amount + (bill.amount * 0.2);
	}

	function _billPms(bill) {
		var pms = [];
		angular.forEach($scope.paymentMethods, function (pm, index) {
			if (pm.bill && pm.bill.id == bill.id) {
				pm.amount = 0.01 * pm.percentage * $scope.subProject.budget;
				pms.push(pm)
			}
		});
		return pms;
	}


	function _calculateTotalPayed() {
		var total = 0;
		angular.forEach($scope.subProject.bills, function (bill, index) {
			if (bill && !bill.isObsolete && bill.isPaid) {
				total += bill.amount;
			}
		});
		return total + (total * 0.2);
	}

	function _calculateTotalNotPayed() {
		return ($scope.subProject.budget + $scope.subProject.budget * 0.2) - _calculateTotalPayed();
	}

	function _calculateTotalBilled() {
		var total = 0;
		angular.forEach($scope.subProject.bills, function (bill, index) {
			if (bill && !bill.isObsolete) {
				total += bill.amount;
			}
		});
		return total + (total * 0.2);
	}

	function _calculateTotalNotBilled() {
		return ($scope.subProject.budget + $scope.subProject.budget * 0.2) - _calculateTotalBilled();
	}
}]);