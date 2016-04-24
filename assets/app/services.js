app.factory('navService', ['$http', function ($http) {
    return {
        page: 'home'
    }
}]);


//USER SERVICE

app.factory('userService', ['$http', '$sails', function ($http, $sails) {
    var o = {
        users: [],
        single: {},
        loggedUser: {}
    };

    o.getSingle = function () {
        return $http.post('', {
            id: projectID
        }).success(function (data) {
            angular.copy(data, o.single);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getById = function (userId, callback) {
        $http.post('/user/getbyid', {
            id: userId
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getLoggedUser = function (callback) {
        return $http.get('/user/loggedUser').success(function (data) {
            angular.copy(data, o.loggedUser);
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getAll = function (callback) {
        return $http.get('/user/getAll').success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.add = function (user, callback) {
        return $http.post('/user/create', user).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.update = function (user, callback) {
        return $http.post('/user/update', {
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            confirmation: user.confirmation,
            role: user.role,
            id: user.id
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.remove = function (userId, callback) {
        return $http.post('/user/remove', {
            userId: userId
        }).success(function (data) {
            o.users.splice(o.users.indexOf(userId), 1);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.subscribe = function (userID) {
        return $http.post('/user/subscribe', {
            userID: userID
        }).success(function () {
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    return o;
}]);

// ROLE SERVICE
app.factory('roleService', ['$http', function ($http) {
    var o = {
        roles: [],
        single: {}
    };
    o.getAll = function (callback) {
        return $http.get('/role/getAll').success(function (data) {
            angular.copy(data, o.roles);
            callback(data)
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.update = function (role) {
        return $http.post('/role/update', {
            id: role.id,
            title: role.title
        }).success(function (data) {
            console.log(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    return o;
}]);

// SETTINGS SERVICE
app.factory('settingsService', ['$http', function ($http) {
    var o = {
        settings: {},
        single: {}
    };
    o.get = function (callback) {
        return $http.get('/settings/get').success(function (data) {
            o.settings = data;
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.update = function (settings, callback) {
        if (settings.id) {
            return $http.post('/settings/update', {
                id: settings.id,
                companyName: settings.companyName,
                email: settings.email,
                phone1: settings.phone1,
                phone2: settings.phone2,
                fax: settings.fax,
                address: settings.address

            }).success(function (data) {
                console.log(data);
                callback();
            }).error(function (data, status, headers, config) {
                console.log(status)
            })
        } else {
            return $http.post('/settings/create', {
                companyName: settings.companyName,
                email: settings.email,
                phone1: settings.phone1,
                phone2: settings.phone2,
                fax: settings.fax,
                address: settings.address
            }).success(function (data) {
                console.log(data);
                callback();
            }).error(function (data, status, headers, config) {
                console.log(status)
            })
        }
    };

    return o;
}]);

app.factory('todosService', ['$http', function ($http) {

}]);
//SUBPROJECT SERVICE
app.factory('subProjectService', ['$http', function ($http) {
    var o = {
        subProjects: [],
        single: {}
    };

    o.getById = function (subProjectID, callback) {
        $http.post('/subproject/getbyid', {
            id: subProjectID
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getByProject = function (projectId, callback) {
        $http.post('/subproject/getByProject', {
            id: projectId
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    }

    o.getAll = function (callback) {
        return $http.get('/subproject/getAll').success(function (data) {
            angular.copy(data, o.subProjects);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.add = function (data, callback) {
        return $http.post('/subproject/addSubproject', data).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.update = function (subproject, callback) {
        $http.post('/subproject/update', {
            id: subproject.id,
            budget: subproject.budget,
            missions: subproject.missions,
            paymentMethods: subproject.paymentMethods,
        }).success(function (subproject) {
            callback(subproject);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.remove = function (subprojectId, callback) {
        return $http.post('/subproject/remove', {
            subprojectId: subprojectId
        }).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.generatePdf = function (data, callback) {
        return $http.post('/file/generatePdf', data).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getTotalBilling = function(projectId,callBack){
        return $http.post('/subproject/getTotalBilling', {
            id: projectId
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    }
    return o;
}]);
//PROJECT SERVICE
app.factory('projectService', ['$http', function ($http) {
    var o = {
        projects: [],
        single: {}
    };

    o.getById = function (projectID) {
        $http.post('/project/getbyid', {
            id: projectID
        }).success(function (data) {
            return data;
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.update = function (project, callback) {
        $http.post('/project/update', project).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getSingle = function (projectID) {
        return $http.post('/project/getbyid', {
            id: projectID
        }).success(function (data) {
            angular.copy(data, o.single);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getAll = function (callback) {
        return $http.get('/project/getAll').success(function (data) {
            angular.copy(data, o.projects);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.add = function (project, callback) {
        return $http.post('/project/create', project).success(function (data) {
            angular.copy(data, o.single);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.addSubproject = function (data, callback) {
        return $http.post('/subproject/addSubproject', data).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.generatePdf = function (data, callback) {
        return $http.post('/file/generatePdf', data).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.remove = function (project, callback) {
        return $http.post('/project/remove', {
            projectID: project.id
        }).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.contractDownloaded = function (project, callback) {
        return $http.post('/project/contractDl', {
            projectID: project.id
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    }
    return o;
}]);
//DESCRIPTION FILE SERVICE
app.factory('descriptionFileService', ['$http', function ($http) {

    var o = {
        descriptionFiles: [],
        single: {}
    };

    o.getById = function (descriptionFileID, callback) {
        $http.post('/descriptionFile/getbyid', {
            id: descriptionFileID
        }).success(function (data) {
            angular.copy(data, o.single);
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getLastVersion = function (projectID, callback) {
        $http.post('/descriptionFile/getlastversion', {
            id: projectID
        }).success(function (data) {
            angular.copy(data, o.single);
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getAllByProject = function (projectID, callback) {
        $http.post('/descriptionFile/getAllByProject', {
            id: projectID
        }).success(function (data) {
            angular.copy(data, o.descriptionFiles);
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getSingle = function (descriptionFileID) {
        return $http.post('/descriptionFile/getbyid', {
            id: descriptionFileID
        }).success(function (data) {
            angular.copy(data, o.single);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getAll = function (callback) {
        return $http.get('/descriptionFile/getAll').success(function (data) {
            angular.copy(data, o.descriptionFiles);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.add = function (descriptionFile, callback) {
        return $http.post('/descriptionFile/create', descriptionFile).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.generateDescriptionFile = function (descriptionFileID, callback) {
        return $http.post('/descriptionFile/generateDescriptionFile', descriptionFileID).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.remove = function (project, callback) {
        return $http.post('/descriptionFile/remove', {
            descriptionFileID: descriptionFile.id
        }).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };


    return o;
}]);
//ACTIVITY SERVICE
app.factory('activityService', ['$http', function ($http) {
    var o = {
        activities: [],
        single: {}
    };

    o.getAll = function (callback) {
        return $http.get('/activity/getAll').success(function (data) {
            angular.copy(data, o.activities);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getById = function (activityID, callback) {
        $http.post('/activity/getById', {
            id: activityID
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.add = function (activity, callback) {
        return $http.post('/activity/create', activity).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getAllByProject = function (projectID, callback) {
        $http.post('/activity/getAllByProject', {
            id: projectID
        }).success(function (data) {
            angular.copy(data, o.activities);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.update = function (activity, callback) {
        return $http.post('/activity/update', {
            id: activity.id,
            title: activity.title,
            status: activity.status,
            description: activity.description,
            date: activity.date,
            contributor: activity.contributor,
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.remove = function (activityId, callback) {
        return $http.post('/activity/remove', {
            id: activityId
        }).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.generateFVDoc = function (data, callback) {
        return $http.post('/activity/generateFVDoc', data).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.deleteAttachedFile = function (element, callback) {
        return $http.post('/file/remove', element).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.generateZip = function(data,callback){
        return $http.post('/activity/genarateZipArchive',data).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    }
    o.sendEmail = function (data, callback) {
        return $http.post('/activity/sendEmail', data).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    return o;

}]);
//PAYMENT METHOD SERVICE
app.factory('paymentMethodService', ['$http', function ($http) {
    var o = {
        paymentMethods: [],
        single: {}
    };
    o.add = function (payment, callback) {
        return $http.post('/paymentMethod/create', payment).success(function (data) {
            angular.copy(data, o.single);
            console.log(data);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getAll = function (callback) {
        return $http.get('/paymentMethod/getAll').success(function (data) {
            angular.copy(data, o.paymentMethods);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getById = function (paymentId, callback) {
        $http.post('/paymentMethod/getById', {
            id: paymentId
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getBySubProject = function (subproject, callback) {
        $http.post('/paymentMethod/getBySubProject', {
            subproject: subproject
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.remove = function (paymentId, callback) {
        return $http.post('/paymentMethod/remove', {
            id: paymentId
        }).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.update = function (payment, callback) {
        return $http.post('/paymentMethod/update', {
            id: payment.id,
            label: payment.label,
            order: payment.order,
            percentage: payment.percentage
        }).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    return o;

}]);
//DOCEXAM SERVICE
app.factory('docExaminationService', ['$http', function ($http) {
    var o = {
        docExaminations: [],
        single: {}
    };
    o.add = function (docExam, callback) {
        return $http.post('/docExamination/create', docExam).success(function (data) {
            angular.copy(data, o.single);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getAll = function (callback) {
        return $http.get('/docExamination/getAll').success(function (data) {
            angular.copy(data, o.docExaminations);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getAllByProject = function (id, callback) {
        $http.post('/docExamination/getAllByProject', {"id": id}).success(function (data) {
            angular.copy(data, o.docExaminations);
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getById = function (docExamID, callback) {
        $http.post('/docExamination/getById', {
            id: docExamID
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.remove = function (docExamID, callback) {
        return $http.post('/docExamination/remove', {
            id: docExamID
        }).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.update = function (docExam, callback) {
        return $http.post('/docExamination/update', docExam).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.createDocument = function (data, callback) {
        return $http.post('/file/generateExamDoc', data).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.sendEmail = function (data, callback) {
        return $http.post('/docexamination/sendEmail', data).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    return o;

}]);
//MESSAGE SERVICE
app.factory('messageService', ['$http', '$sails', function ($http, $sails) {
    var o = {
        messages: [],
        new: [],
        single: {}
    };

    o.getSingle = function () {

    };

    o.getAll = function () {
        return $http.get('/message/getMyMessages').success(function (data) {
            angular.copy(data, o.messages);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.create = function (message, from, to) {
        return $sails.post('/message/create', {
            content: message,
            from: from,
            to: to,
            new: true
        }).success(function (data) {
            console.log(status)
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getNew = function () {
        return $http.get('/message/getNewMessages').success(function (data) {
            angular.copy(data, o.new);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    return o;
}]);

//CUSTOMER SERVICE
app.factory('customerService', ['$http', function ($http) {
    var o = {
        customers: [],
        single: {}
    };

    o.add = function (customer, callback) {
        return $http.post('/customer/create', customer).success(function (data) {
            angular.copy(data, o.single);
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.remove = function (customerID, callback) {
        return $http.post('/customer/remove', {
            customerID: customerID
        }).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.update = function (customer, callback) {
        return $http.post('/customer/update', {
            id: customer.id,
            contactPerson: customer.contactPerson,
            phone: customer.phone,
            email: customer.email,
            address: customer.address,
            company: customer.company,
            cellphone: customer.cellphone,
            zip: customer.zip,
            type: customer.type,
        }).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getAll = function (callback) {
        return $http.get('/customer/getAll').success(function (data) {
            angular.copy(data, o.customers);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getById = function (customerId, callback) {
        $http.post('/customer/getById', {
            id: customerId
        }).success(function (data) {
            angular.copy(data, o.single);
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getAllPromise = function () {
        $http.get('/customer/getAll').success(function (data) {
            return data;
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    }
    return o;
}]);

app.factory('participantService', ['$http', function ($http) {
    var o = {
        participants: [],
        single: {}
    };
    o.add = function (participant, callback) {
        return $http.post('/participant/create', participant).success(function (data) {
            angular.copy(data, o.single);
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getAll = function (callback) {
        return $http.get('/participant/getAll').success(function (data) {
            angular.copy(data, o.participants);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.remove = function (participantID, callback) {
        return $http.post('/participant/remove', {
            participantID: participantID
        }).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.update = function (participant, callback) {
        return $http.post('/participant/update', {
            id: participant.id,
            contactPerson: participant.contactPerson,
            phone: participant.phone,
            email: participant.email,
            address: participant.address,
            company: participant.company,
            cellphone: participant.cellphone,
            zip: participant.zip,
            type: participant.type,
        }).success(function (data) {
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getById = function (participantId, callback) {
        $http.post('/participant/getById', {
            id: participantId
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    return o;
}]);

app.factory('typeService', ['$http', function ($http) {
    var o = {
        types: [],
        single: {}
    };

    o.add = function (type, callback) {
        return $http.post('/type/create', type).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.update = function (type, callback) {
        return $http.post('/type/update', type).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

	o.getAll = function (callback) {
		return $http.get('/type/getAll').success(function (data) {
			angular.copy(data, o.types);
			callback();
		}).error(function (data, status, headers, config) {
			console.log(status)
		})
	};

    o.remove = function (typeId, callback) {
        return $http.post('/type/remove', {
            id: typeId
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

	return o;
}]);

app.factory('billingService', ['$http', function ($http) {
    var o = {
        bills: [],
        single: {}
    };

    o.getAllByProject = function (project, callback) {
        return $http.post('/bill/getProjectBills', {
            project: project
        }).success(function (data) {
            angular.copy(data, o.bills);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.create = function (element, callback) {
        return $http.post('/bill/create', element).success(function (data) {
            angular.copy(data, o.single);
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.generateInvoice = function (element, callback) {
        return $http.post('/file/generateInvoice', element).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.setPayed = function (element, callback) {
        return $http.post('/bill/setPayed', element).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.setPayed = function (element, callback) {
        return $http.post('/bill/setPayed', element).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };


    o.setNotPayed = function (element, callback) {
        return $http.post('/bill/setNotPayed', element).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    return o;
}]);

app.factory('roleService', ['$http', function ($http) {
    var o = {
        roles: [],
        single: {}
    };

    o.add = function (role, callback) {
        return $http.post('/role/create', role).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.update = function (role, callback) {
        return $http.post('/role/update', role).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.getAll = function (callback) {
        return $http.get('/role/getAll').success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    o.remove = function (roleId, callback) {
        return $http.post('/role/remove', {
            id: roleId
        }).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };

    return o;
}]);

app.factory('permissionService', ['$http', function ($http) {
    var o = {
        permissions: [],
        single: {}
    };
    o.getAll = function (callback) {
        return $http.get('/permission/getAll').success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    return o;
}]);

app.factory('commentService', ['$http', function ($http) {
    var o = {
        messages: [],
        single: {}
    };
    o.send = function (data, callback) {
        return $http.post('/comment/sendAndSave', data).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getAll = function (callback) {
        return $http.get('/comment/getAll').success(function (data) {
            angular.copy(data, o.messages);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.getByProject = function (projectId,callback) {
        return $http.post('/comment/getByProject',{project:projectId}).success(function (data) {
            angular.copy(data, o.messages);
            callback();
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    o.remove = function (message,callback) {
        return $http.post('/comment/removeMessage',{id:message.id}).success(function (data) {
            callback(data);
        }).error(function (data, status, headers, config) {
            console.log(status)
        })
    };
    return o;
}]);

app.factory('customersResource', ['$resource', function ($resource) {
    return $resource('/customer/getAll');
}]);

app.factory('projectResource', ['$resource', function ($resource) {
    return $resource('/project/getAll');
}]);
app.factory('subProjectResource', ['$resource', function ($resource) {
    return $resource('/subproject/getAll');
}]);

app.factory('singleProjectResource', ['$resource', function ($resource) {
    return $resource('/project/getById', {
        id: '@id'
    });
}]);

app.factory('participantsResource', ['$resource', function ($resource) {
    return $resource('/participant/getAll');
}]);

app.factory('usersResource', ['$resource', function ($resource) {
    return $resource('/user/getAll');
}]);

app.factory('dirEngResource', ['$resource', function ($resource) {
    return $resource('/user/getDirectersAndEngineers');
}]);

app.factory('missionsResource', ['$resource', function ($resource) {
    return $resource('/mission/getAll');
}]);

app.factory('paymentMethodsResource', ['$resource', function ($resource) {
    return $resource('/paymentmethod/getAll');
}]);

app.factory('typeResource', ['$resource', function ($resource) {
    return $resource('/type/getAll');
}]);

app.factory('statsResource', ['$resource', function ($resource) {
    return $resource('/project/getStats');
}]);

app.factory('visitsResource', ['$resource', function ($resource) {
    return $resource('/activity/getAll');
}]);



app.factory('numberToWordsService', function () {
    var o = {};
    var res, plus, diz, s, un, mil, mil2, ent, deci, centi, pl, pl2, conj;

    var t = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
    var t2 = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
    var t3 = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];

    function decint(n) {

        switch (n.length) {
            case 1 :
                return dix(n);
            case 2 :
                return dix(n);
            case 3 :
                return cent(n.charAt(0)) + " " + decint(n.substring(1));
            default:
                mil = n.substring(0, n.length - 3);
                if (mil.length < 4) {
                    un = (mil == 1) ? "" : decint(mil);
                    return un + mille(mil) + " " + decint(n.substring(mil.length));
                }
                else {
                    mil2 = mil.substring(0, mil.length - 3);
                    return decint(mil2) + million(mil2) + " " + decint(n.substring(mil2.length));
                }
        }
    }

    function dix(n) {
        if (n < 10) {
            return t[parseInt(n)]
        }
        else if (n > 9 && n < 20) {
            return t2[n.charAt(1)]
        }
        else {
            plus = n.charAt(1) == 0 && n.charAt(0) != 7 && n.charAt(0) != 9 ? "" : (n.charAt(1) == 1 && n.charAt(0) < 8) ? " et " : "-";
            diz = n.charAt(0) == 7 || n.charAt(0) == 9 ? t2[n.charAt(1)] : t[n.charAt(1)];
            s = n == 80 ? "s" : "";

            return t3[n.charAt(0)] + s + plus + diz;
        }
    }

    function cent(n) {
        return n > 1 ? t[n] + " cent" : (n == 1) ? " cent" : "";
    }

    function mille(n) {
        return n >= 1 ? " mille" : "";
    }

    function million(n) {
        return n >= 1 ? " millions" : " million";
    }


    o.convert = function (n) {
        n = '' + n;

        if (!/^\d+[.,]?\d*$/.test(n)) {
            return "L'expression entrée n'est pas un nombre."
        }

        n = n.replace(/(^0+)|(\.0+$)/g, "");
        n = n.replace(/([.,]\d{2})\d+/, "$1");
        n1 = n.replace(/[,.]\d*/, "");
        n2 = n1 != n ? n.replace(/\d*[,.]/, "") : false;

        ent = !n1 ? "" : decint(n1);
        deci = !n2 ? "" : decint(n2);
        if (!n1 && !n2) {
            return "Zéro Euros. (Mais, de préférence, entrez une valeur non nulle!)"
        }
        conj = !n2 || !n1 ? "" : "  et ";
        dh = !n1 ? "" : !/[23456789]00$/.test(n1) ? " Dirham" : "Dirham";
        centi = !n2 ? "" : " centime";
        pl = n1 > 1 ? "s" : "";
        pl2 = n2 > 1 ? "s" : "";

        return (ent + dh + pl + conj + deci + centi + pl2).replace(/\s+/g, " ").replace("cent s E", "cents E");
    };
    return o;
});