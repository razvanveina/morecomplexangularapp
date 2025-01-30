import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventManagerComponent } from './app/event.manager';

bootstrapApplication(EventManagerComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(FormsModule),
  ],
}).catch((err) => console.error(err));
