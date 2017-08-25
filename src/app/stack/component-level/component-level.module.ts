import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ComponentLevelComponent} from './component-level.component';
import {EllipsisDirective} from '../utils/ellipsis.directive';
// import {SentimentModule} from '../utils/sentiment/sentiment.module';

import {TableFilter} from '../utils/table-filter.pipe';
import {ToastNotificationComponent} from '../toast-notification/toast-notification.component';
// import {TableOrderByPipe} from '../utils/table-orderby.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ComponentLevelComponent,
        EllipsisDirective,
        TableFilter,
        ToastNotificationComponent
    ],
    exports: [
        ComponentLevelComponent
    ]
})

export class ComponentLevelModule {

}
