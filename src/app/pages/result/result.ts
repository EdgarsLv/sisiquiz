import { CommonModule, Location } from '@angular/common';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

type TResult = {
  date: string;
  score: number;
  timeSpent: number;
};

@Component({
  selector: 'app-result',
  imports: [CommonModule, ButtonModule, TranslatePipe],
  templateUrl: './result.html',
  styleUrl: './result.scss',
})
export class Result implements OnInit {
  public result = input<TResult>();
  public image = input<string>('');

  private meta = inject(Meta);
  private title = inject(Title);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  public timeSpent = computed(() => Math.ceil(this.result()!.timeSpent / 60));

  private paramId = signal<string | null>(null);
  public showShare = signal<boolean>(false);

  public ngOnInit(): void {
    const browserState = this.location.getState() as { owner?: boolean };
    const isOwnerView = browserState?.owner === true;
    this.showShare.set(isOwnerView);

    const id = this.route.snapshot.paramMap.get('id');
    this.paramId.set(id);

    // Set dynamic meta tags
    this.title.setTitle('IQ Test Result');
    this.meta.updateTag({
      name: 'description',
      content: `Check out my IQ test result!`,
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'IQ Test Result',
    });
    this.meta.updateTag({
      property: 'og:description',
      content: `I scored ${this.result()!.score} on the IQ test.`,
    });
    this.meta.updateTag({
      property: 'og:image',
      content: this.image(),
    });
    this.meta.updateTag({
      property: 'og:url',
      content: `https://sisiquiz.com/result/${id}`,
    });
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: 'IQ Test Result' });
    this.meta.updateTag({
      name: 'twitter:description',
      content: `I scored ${this.result()!.score} on the IQ test.`,
    });
    this.meta.updateTag({ name: 'twitter:image', content: this.image() });
  }

  public copyUrl(): void {
    const shareUrl = window.location.href;

    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Link copied to clipboard!');
    });
  }

  public shareUrl() {
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator
        .share({
          url: shareUrl,
        })
        .catch((err) => console.error('Sharing failed', err));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }
}
