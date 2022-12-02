'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-5286bc6ffc90fa67718f0b1390603677e7786abfece448815884e12657ceae6de608993c83921b8397db5013717ec3be9ff08c2c321a07a3f6eec3333bbe070a"' : 'data-target="#xs-controllers-links-module-AuthModule-5286bc6ffc90fa67718f0b1390603677e7786abfece448815884e12657ceae6de608993c83921b8397db5013717ec3be9ff08c2c321a07a3f6eec3333bbe070a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-5286bc6ffc90fa67718f0b1390603677e7786abfece448815884e12657ceae6de608993c83921b8397db5013717ec3be9ff08c2c321a07a3f6eec3333bbe070a"' :
                                            'id="xs-controllers-links-module-AuthModule-5286bc6ffc90fa67718f0b1390603677e7786abfece448815884e12657ceae6de608993c83921b8397db5013717ec3be9ff08c2c321a07a3f6eec3333bbe070a"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-5286bc6ffc90fa67718f0b1390603677e7786abfece448815884e12657ceae6de608993c83921b8397db5013717ec3be9ff08c2c321a07a3f6eec3333bbe070a"' : 'data-target="#xs-injectables-links-module-AuthModule-5286bc6ffc90fa67718f0b1390603677e7786abfece448815884e12657ceae6de608993c83921b8397db5013717ec3be9ff08c2c321a07a3f6eec3333bbe070a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-5286bc6ffc90fa67718f0b1390603677e7786abfece448815884e12657ceae6de608993c83921b8397db5013717ec3be9ff08c2c321a07a3f6eec3333bbe070a"' :
                                        'id="xs-injectables-links-module-AuthModule-5286bc6ffc90fa67718f0b1390603677e7786abfece448815884e12657ceae6de608993c83921b8397db5013717ec3be9ff08c2c321a07a3f6eec3333bbe070a"' }>
                                        <li class="link">
                                            <a href="injectables/AccessTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccessTokenStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RefreshTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RefreshTokenStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TeamsModule.html" data-type="entity-link" >TeamsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-TeamsModule-9eb6d1aa800913d2ab32abb8f762af6b80e4fb45eca925a26f02e838d94f6d38d962b21a4e70f12dc25d9f4bc1c5b550e301bfe6bf63b105d70005d7fbb28d24"' : 'data-target="#xs-controllers-links-module-TeamsModule-9eb6d1aa800913d2ab32abb8f762af6b80e4fb45eca925a26f02e838d94f6d38d962b21a4e70f12dc25d9f4bc1c5b550e301bfe6bf63b105d70005d7fbb28d24"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TeamsModule-9eb6d1aa800913d2ab32abb8f762af6b80e4fb45eca925a26f02e838d94f6d38d962b21a4e70f12dc25d9f4bc1c5b550e301bfe6bf63b105d70005d7fbb28d24"' :
                                            'id="xs-controllers-links-module-TeamsModule-9eb6d1aa800913d2ab32abb8f762af6b80e4fb45eca925a26f02e838d94f6d38d962b21a4e70f12dc25d9f4bc1c5b550e301bfe6bf63b105d70005d7fbb28d24"' }>
                                            <li class="link">
                                                <a href="controllers/TeamsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TeamsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TeamsModule-9eb6d1aa800913d2ab32abb8f762af6b80e4fb45eca925a26f02e838d94f6d38d962b21a4e70f12dc25d9f4bc1c5b550e301bfe6bf63b105d70005d7fbb28d24"' : 'data-target="#xs-injectables-links-module-TeamsModule-9eb6d1aa800913d2ab32abb8f762af6b80e4fb45eca925a26f02e838d94f6d38d962b21a4e70f12dc25d9f4bc1c5b550e301bfe6bf63b105d70005d7fbb28d24"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TeamsModule-9eb6d1aa800913d2ab32abb8f762af6b80e4fb45eca925a26f02e838d94f6d38d962b21a4e70f12dc25d9f4bc1c5b550e301bfe6bf63b105d70005d7fbb28d24"' :
                                        'id="xs-injectables-links-module-TeamsModule-9eb6d1aa800913d2ab32abb8f762af6b80e4fb45eca925a26f02e838d94f6d38d962b21a4e70f12dc25d9f4bc1c5b550e301bfe6bf63b105d70005d7fbb28d24"' }>
                                        <li class="link">
                                            <a href="injectables/TeamsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TeamsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UsersModule-676961445f06dff5d442c338e6961e4b23813a921b6253fb95c9980a17dcc7d739627284d1279e488e117be656e7da3774f9dbe7265a452ee95e34f10ad8be84"' : 'data-target="#xs-controllers-links-module-UsersModule-676961445f06dff5d442c338e6961e4b23813a921b6253fb95c9980a17dcc7d739627284d1279e488e117be656e7da3774f9dbe7265a452ee95e34f10ad8be84"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-676961445f06dff5d442c338e6961e4b23813a921b6253fb95c9980a17dcc7d739627284d1279e488e117be656e7da3774f9dbe7265a452ee95e34f10ad8be84"' :
                                            'id="xs-controllers-links-module-UsersModule-676961445f06dff5d442c338e6961e4b23813a921b6253fb95c9980a17dcc7d739627284d1279e488e117be656e7da3774f9dbe7265a452ee95e34f10ad8be84"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-676961445f06dff5d442c338e6961e4b23813a921b6253fb95c9980a17dcc7d739627284d1279e488e117be656e7da3774f9dbe7265a452ee95e34f10ad8be84"' : 'data-target="#xs-injectables-links-module-UsersModule-676961445f06dff5d442c338e6961e4b23813a921b6253fb95c9980a17dcc7d739627284d1279e488e117be656e7da3774f9dbe7265a452ee95e34f10ad8be84"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-676961445f06dff5d442c338e6961e4b23813a921b6253fb95c9980a17dcc7d739627284d1279e488e117be656e7da3774f9dbe7265a452ee95e34f10ad8be84"' :
                                        'id="xs-injectables-links-module-UsersModule-676961445f06dff5d442c338e6961e4b23813a921b6253fb95c9980a17dcc7d739627284d1279e488e117be656e7da3774f9dbe7265a452ee95e34f10ad8be84"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TeamsController.html" data-type="entity-link" >TeamsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AuthDto.html" data-type="entity-link" >AuthDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTeamDto.html" data-type="entity-link" >CreateTeamDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DetailsDto.html" data-type="entity-link" >DetailsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Team.html" data-type="entity-link" >Team</a>
                            </li>
                            <li class="link">
                                <a href="classes/TeamHistory.html" data-type="entity-link" >TeamHistory</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateTeamDto.html" data-type="entity-link" >UpdateTeamDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDetails.html" data-type="entity-link" >UserDetails</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AccessTokenGuard.html" data-type="entity-link" >AccessTokenGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccessTokenStrategy.html" data-type="entity-link" >AccessTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshTokenGuard.html" data-type="entity-link" >RefreshTokenGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshTokenStrategy.html" data-type="entity-link" >RefreshTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TeamsService.html" data-type="entity-link" >TeamsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserUpdateSelfDto.html" data-type="entity-link" >UserUpdateSelfDto</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/TeamHistoryInterface.html" data-type="entity-link" >TeamHistoryInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});