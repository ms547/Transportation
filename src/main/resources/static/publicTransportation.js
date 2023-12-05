var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    const URL = "https://fir-1c7de-default-rtdb.firebaseio.com/publicTransportation";
    $scope.orderDetails = {};
    $scope.routeDetails = {};
    $("#routeTicketDetailsDivId").show();
    $("#vehicleListDivId").hide();
    $("#purchaseTicketId").hide();
    $("#iteamAddDivId").hide();
    $("#routeTicketAddDivId").hide();
    $scope.viewOrderTableData = [];
    $scope.loginUserDetails = localStorage.getItem("loginUserDetails");
    $scope.loginUserDetails = JSON.parse($scope.loginUserDetails);
    getRouteist();

    $scope.getOrderData = function (data) {
        $scope.ticketPurchase = {}
        $scope.ticketPurchase["noOfTicket"] = 1;
        //$("#ticketCosttId").val(data.priceId);
        $scope.orderDetails = data;

    }
    //add purchnase ticket
    $scope.purchaseTicket = function () {
        if ($("#paymentModeId").val() == "") {
            alert("Please select payment mode");
        } else {
            $scope.ticketPurchase["ticketCosttId"] = $("#ticketCosttId").val();
            $scope.ticketPurchase["purchaseDate"] = new Date().toISOString().split("T")[0];
            $scope.ticketPurchase["routeDetails"] = { ...$scope.orderDetails };
            delete $scope.ticketPurchase.routeDetails["$$hashKey"];
            $.ajax({
                type: 'post',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: URL + "/purchasedTicketList/" + $scope.orderDetails.vehicleName.ownerId + ".json",
                data: JSON.stringify($scope.ticketPurchase),
                success: function (response) {
                    $('#purchaseTicket').modal('hide');
                    alert("Ticket Purchased!!!");
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        }
    }
    //Purchase List
    $scope.getPurchaseList = function () {
        let url = URL + "/purchasedTicketList.json"
        if ($scope.loginUserDetails.userType == 'MANAGER') {
            url = URL + "/purchasedTicketList/" + $scope.loginUserDetails.userId + ".json";
        }
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: url,
            success: function (response) {
                $scope.purchaseList = [];
                let routeList = []
                if ($scope.loginUserDetails.userType != 'MANAGER') {
                    for (let i in response) {
                        for (let j in response[i]) {
                            let data = response[i][j];
                            data["purchaseId"] = j;
                            data["userOwnerId"] = i;
                            $scope.purchaseList.unshift(data);
                        }

                    }
                } else {
                    for (let i in response) {
                        let data = response[i];
                        data["purchaseId"] = i;
                        routeList.push(data);
                    }
                    $scope.purchaseList = [...routeList];
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    function getVehicleist() {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addNewVehicle/" + $scope.loginUserDetails.userId + ".json",
            success: function (lresponse) {
                $scope.vehicleList = [];
                let vehicleListData = []
                for (let i in lresponse) {
                    let data = lresponse[i];
                    data["newVeihicleId"] = i;
                    vehicleListData.push(data);
                }
                $scope.vehicleList = [...vehicleListData];

                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.addVehicle = function () {
        let requestBody = {
            "descriptionId": $("#descriptionId").val(),
            "vehicleName": $("#vehicleNameId").val(),
            "ownerId": $scope.loginUserDetails.userId,
            "noPlateNumId": $("#noPlateNumId").val()
        };
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addNewVehicle/" + $scope.loginUserDetails.userId + ".json",
            data: JSON.stringify(requestBody),
            success: function (response) {
                alert("Data added sucessfully!!!");
                $("#descriptionId").val('');
                $("#vehicleNameId").val('');
                $("#noPlateNumId").val('');
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.removeVehicle = function (data) {
        $.ajax({
            type: 'delete',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addNewVehicle/" + $scope.loginUserDetails.userId + "/" + data.newVeihicleId + ".json",
            success: function (response) {
                getVehicleist();
                alert("Removed successfuly !!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });

    }
    //Route
    function getRouteist() {
        let url = URL + "/routeTicketList.json"
        if ($scope.loginUserDetails.userType == 'MANAGER') {
            url = URL + "/routeTicketList/" + $scope.loginUserDetails.userId + ".json";
        }
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: url,
            success: function (response) {
                $scope.routeList = [];
                let routeList = []
                if ($scope.loginUserDetails.userType != 'MANAGER') {
                    for (let i in response) {
                        for (let j in response[i]) {
                            let data = response[i][j];
                            data["routeTicketId"] = j;
                            data["userOwnerId"] = i;
                            $scope.routeList.unshift(data);
                        }

                    }
                } else {
                    for (let i in response) {
                        let data = response[i];
                        data["routeTicketId"] = i;
                        routeList.push(data);
                    }
                    $scope.routeList = [...routeList];
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.addRouteTicket = function () {
        if ($scope.routeDetails.vehicleName == "") {
            alert("Please select vehicle");
            return false;
        }
        delete $scope.routeDetails.vehicleName["$$hashKey"]
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/routeTicketList/" + $scope.loginUserDetails.userId + ".json",
            data: JSON.stringify($scope.routeDetails),
            success: function (response) {
                alert("Data added sucessfully!!!");
                $scope.routeDetails = {};
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.removeRoute = function (data) {
        $.ajax({
            type: 'delete',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/routeTicketList/" + $scope.loginUserDetails.userId + "/" + data.routeTicketId + ".json",
            success: function (response) {
                getRouteist();
                alert("Removed successfuly !!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });

    }
    $scope.logout = function () {
        localStorage.clear();
        window.location.href = "publicTransportationLogin.html";
    }
    $scope.switchMenu = function (type, id) {
        $(".menuCls").removeClass("active");
        $('#' + id).addClass("active");
        $("#routeTicketDetailsDivId").hide();
        $("#vehicleListDivId").hide();
        $("#purchaseTicketId").hide();
        $("#iteamAddDivId").hide();
        $("#routeTicketAddDivId").hide()
        if (type == "ROUTE_TICKET_DETAILS") {
            getRouteist();
            $("#routeTicketDetailsDivId").show();
        } else if (type == "MENU") {
            $("#vehicleListDivId").show();
            getVehicleist();
        } else if (type == "ADD_ROUTE") {
            getVehicleist();
            $("#routeTicketAddDivId").show();
        } else if (type == "ADD_VEHICLE") {
            $("#iteamAddDivId").show();
        } else if (type == "HISTORY") {
            $("#purchaseTicketId").show();
            $scope.getPurchaseList();
        }
    }

});
