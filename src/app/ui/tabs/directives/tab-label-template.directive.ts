import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTabLabelTemplate]',
  standalone: true,
  exportAs: 'tabLabelTemplate',
})
export class TabLabelTemplateDirective {
  public template: TemplateRef<TabLabelTemplateDirective> = inject(
    TemplateRef<TabLabelTemplateDirective>
  );
}
