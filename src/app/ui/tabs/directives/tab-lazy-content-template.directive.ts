import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTabLazyContentTemplate]',
  standalone: true,
  exportAs: 'tabLazyContentTemplate',
})
export class TabLazyContentTemplateDirective {
  public template: TemplateRef<TabLazyContentTemplateDirective> = inject(
    TemplateRef<TabLazyContentTemplateDirective>
  );
}
