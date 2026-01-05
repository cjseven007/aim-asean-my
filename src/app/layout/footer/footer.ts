import { Component } from '@angular/core';
import { FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { faInstagram, faLinkedin, faFacebook, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  imports: [FontAwesomeModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  faInstagram = faInstagram;
  faLinkedin = faLinkedin;
  faFacebook = faFacebook;
  faTiktok = faTiktok;
  faYoutube = faYoutube;
  faEnvelope = faEnvelope;

  backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
