import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { ButtonDirective } from '@ui/buttons/directives';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { GoBackNavigationStrategy } from './types/go-back-navigation-strategy';
import { ButtonType } from '@ui/buttons/types';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [ButtonDirective, RouterLink],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent {
  protected readonly DEFAULT_LABEL: string = 'Back';

  @Input() public type: ButtonType = 'primary';
  @Input() public label?: string;

  private readonly router: Router = inject(Router);
  private readonly location: Location = inject(Location);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly routerLink: string[] = ['..'];
  private readonly previousUrl?: string;
  private readonly currentUrl?: string;

  public constructor() {
    this.previousUrl = this.router
      .getCurrentNavigation()
      ?.previousNavigation?.finalUrl?.toString();

    this.currentUrl = this.router.getCurrentNavigation()?.finalUrl?.toString();
  }

  public onClicked(): void {
    this.goBack(this.determineNavigationStrategy());
  }

  private goBack(strategy: GoBackNavigationStrategy): void {
    if (strategy === 'use-location-back') {
      this.location.back();
    } else {
      this.router.navigate(this.routerLink, {
        relativeTo: this.activatedRoute,
      });
    }
  }

  private determineNavigationStrategy(): GoBackNavigationStrategy {
    if (!this.previousUrl || !this.currentUrl) {
      return 'go-one-level-up';
    }

    const isPreviousUrlTheParentOfCurrentUrl: boolean =
      this.currentUrl.startsWith(this.previousUrl);

    return isPreviousUrlTheParentOfCurrentUrl
      ? 'use-location-back'
      : 'go-one-level-up';
  }
}
