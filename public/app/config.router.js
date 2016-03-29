'use strict';
angular.module('app')
    .run(
        [
            '$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    )
    .config(
        [
            '$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {
                $urlRouterProvider
                    .otherwise('/login');
                $stateProvider
                    .state('login', {
                        url: '/login',
                        templateUrl: 'views/login.html',
                        ncyBreadcrumb: {
                            label: 'Login'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'app/controllers/login.js'
                                        ]
                                    });
                                }
                            ]
                        }
                    })

                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'views/layout.html',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'app/controllers/sidebar.js'
                                        ]
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.home', {
                        url: '/home',
                        templateUrl: 'views/home.html',
                        ncyBreadcrumb: {
                            label: '首页',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/datepicker.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/home.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.oas5MinData', {
                        url: '/oas5MinData',
                        templateUrl: 'views/oas-5min.html',
                        ncyBreadcrumb: {
                            label: '五分钟视图',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'lib/highcharts/highcharts.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/datepicker.js',
                                                        'app/controllers/daterangepicker.js',
                                                        'app/controllers/oasHeader.js',
                                                        'app/controllers/oas5MinData.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.trendOfWagner', {
                        url: '/trendOfWagner',
                        templateUrl: 'views/oas-kanpan.html',
                        ncyBreadcrumb: {
                            label: '指标趋势看盘',
                            description: '日看盘、周看盘、月看盘'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'lib/highcharts/highcharts.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/datepicker.js',
                                                        'app/controllers/daterangepicker.js',
                                                        'app/controllers/oasHeader.js',
                                                        'app/controllers/oasKanpanData.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.fiveForcesModel', {
                        url: '/fiveForcesModel',
                        templateUrl: 'views/oas-5li.html',
                        ncyBreadcrumb: {
                            label: '五力模型',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'lib/highcharts/highcharts.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/datepicker.js',
                                                        'app/controllers/daterangepicker.js',
                                                        'app/controllers/oasHeader.js',
                                                        'app/controllers/oas5liData.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.stepLost', {
                        url: '/stepLost',
                        templateUrl: 'views/oas-steplost.html',
                        ncyBreadcrumb: {
                            label: '节点留存',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'lib/highcharts/highcharts.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/datepicker.js',
                                                        'app/controllers/daterangepicker.js',
                                                        'app/controllers/oasHeader.js',
                                                        'app/controllers/oasStepLost.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.userRetention', {
                        url: '/userRetention',
                        templateUrl: 'views/oas-liucun.html',
                        ncyBreadcrumb: {
                            label: '新用户留存率',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'lib/highcharts/highcharts.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/datepicker.js',
                                                        'app/controllers/daterangepicker.js',
                                                        'app/controllers/oasHeader.js',
                                                        'app/controllers/oasLiucunData.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.channelAppList', {
                        url: '/channelAppList',
                        templateUrl: 'views/channel-appList.html',
                        ncyBreadcrumb: {
                            label: '游戏包管理',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/select2.js',
                                                        'app/controllers/channelAppList.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.channelDataRepair', {
                        url: '/channelDataRepair',
                        templateUrl: 'views/channel-dataRepair.html',
                        ncyBreadcrumb: {
                            label: '数据补录',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster', 'ui.select','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/select2.js',
                                                        'app/controllers/channelDataRepair.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.budget', {
                        url: '/budget',
                        templateUrl: 'views/app-budget.html',
                        ncyBreadcrumb: {
                            label: '游戏投放预算录入',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/datepicker.js',
                                                        'app/controllers/daterangepicker.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/select2.js',
                                                        'app/controllers/channelAppBudget.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.channelRemark', {
                        url: '/channelRemark',
                        templateUrl: 'views/channel-remark.html',
                        ncyBreadcrumb: {
                            label: '渠道数据备注录入',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/datepicker.js',
                                                        'app/controllers/daterangepicker.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/select2.js',
                                                        'app/controllers/channelRemark.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.channelPrice', {
                        url: '/channelPrice',
                        templateUrl: 'views/channel-price.html',
                        ncyBreadcrumb: {
                            label: '投放单价',
                            description: ''
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select', 'ngTagsInput','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/select2.js',
                                                        'app/controllers/datepicker.js',
                                                        'app/controllers/daterangepicker.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'lib/jquery/textarea/jquery.autosize.js',
                                                        'lib/jquery/datatable/ZeroClipboard.js',
                                                        'app/controllers/channelPrice.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.channelDetail', {
                        url: '/channelDetail',
                        ncyBreadcrumb: {
                            label: '渠道详情'
                        },
                        templateUrl: 'views/channel-detail.html',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ui.select', 'ngTagsInput','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/select2.js',
                                                        'app/controllers/datepicker.js',
                                                        'app/controllers/daterangepicker.js',
                                                        'lib/highcharts/highcharts.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        //'lib/jquery/fuelux/spinbox/fuelux.spinbox.js',
                                                        //'lib/jquery/knob/jquery.knob.js',
                                                        //'lib/jquery/textarea/jquery.autosize.js',
                                                        //'lib/jquery/datatable/dataTables.bootstrap.css',
                                                        //'lib/jquery/datatable/jquery.dataTables.js',
                                                        //'lib/jquery/datatable/ZeroClipboard.js',
                                                        //'lib/jquery/datatable/dataTables.tableTools.min.js',
                                                        //'lib/jquery/datatable/dataTables.bootstrap.min.js',
                                                        'app/controllers/adCheck.js',
                                                        'app/controllers/channelDetail.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.sdkAppVersion', {
                        url: '/sdkAppVersion',
                        ncyBreadcrumb: {
                            label: '游戏母包版本'
                        },
                        templateUrl: 'views/sdk-version.html',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select', 'ngTagsInput','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/select2.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/sdkVersion.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.sdkAppSecret', {
                        url: '/sdkAppSecret',
                        ncyBreadcrumb: {
                            label: 'Android签名文件'
                        },
                        templateUrl: 'views/sdk-appSecret.html',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select', 'ngTagsInput','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/select2.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/sdkAppSecret.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.sdkPackage', {
                        url: '/sdkPackage',
                        ncyBreadcrumb: {
                            label: '打包管理'
                        },
                        templateUrl: 'views/sdk-package.html',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/sdkPackage.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.channelPackageVersion', {
                        url: '/channelPackageVersion',
                        ncyBreadcrumb: {
                            label: '渠道包版本'
                        },
                        templateUrl: 'views/sdk-channelPackageVersion.html',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select', 'ngTagsInput','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/select2.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/channelPackage.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.sdkApplist', {
                        url: '/sdkApplist',
                        ncyBreadcrumb: {
                            label: '游戏列表'
                        },
                        templateUrl: 'views/sdk-appList.html',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster', 'ui.select', 'ngTagsInput','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/select2.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/sdkAppList.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.sdkChannelList', {
                        url: '/sdkChannel',
                        ncyBreadcrumb: {
                            label: '渠道列表'
                        },
                        templateUrl: 'views/sdk-channel.html',
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['toaster','ui.select', 'ngTagsInput','daterangepicker']).then(
                                        function() {
                                            return $ocLazyLoad.load(
                                                {
                                                    serie: true,
                                                    files: [
                                                        'app/controllers/select2.js',
                                                        'lib/modules/angular-daterangepicker/moment.js',
                                                        'app/controllers/sdkChannel.js'
                                                    ]
                                                });
                                        }
                                    );
                                }
                            ]
                        }
                    })
                    .state('app.elements', {
                        url: '/elements',
                        templateUrl: 'views/elements.html',
                        ncyBreadcrumb: {
                            label: 'UI Elements',
                            description: 'Basics'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'app/controllers/pagination.js',
                                            'app/controllers/progressbar.js'
                                        ]
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.formlayout', {
                        url: '/formlayout',
                        templateUrl: 'views/form-layout.html',
                        ncyBreadcrumb: {
                            label: 'Form Layouts'
                        }
                    })
                    .state('app.forminputs', {
                        url: '/forminputs',
                        templateUrl: 'views/form-inputs.html',
                        ncyBreadcrumb: {
                            label: 'Form Inputs'
                        }
                    })
                    .state('app.formwizard', {
                        url: '/formwizard',
                        templateUrl: 'views/form-wizard.html',
                        ncyBreadcrumb: {
                            label: 'Form Wizard'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'lib/jquery/fuelux/wizard/wizard-custom.js'
                                        ]
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.formvalidation', {
                        url: '/formvalidation',
                        templateUrl: 'views/form-validation.html',
                        ncyBreadcrumb: {
                            label: 'Form Validation',
                            description: 'Bootstrap Validator'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'app/controllers/validation.js'
                                        ]
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.fontawesome', {
                        url: '/fontawesome',
                        templateUrl: 'views/font-awesome.html',
                        ncyBreadcrumb: {
                            label: 'FontAwesome',
                            description: 'Iconic Fonts'
                        }
                    })
                    .state('app.modals', {
                        url: '/modals',
                        templateUrl: 'views/modals.html',
                        ncyBreadcrumb: {
                            label: 'Modals',
                            description: 'Modals and Wells'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'app/controllers/modal.js'
                                        ]
                                    });
                                }
                            ]
                        }
                    })
                    .state('app.buttons', {
                        url: '/buttons',
                        templateUrl: 'views/buttons.html',
                        ncyBreadcrumb: {
                            label: 'Buttons'
                        },
                        resolve: {
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'app/controllers/button.js',
                                            'app/controllers/dropdown.js'
                                        ]
                                    });
                                }
                            ]
                        }
                    });
            }
        ]
    );