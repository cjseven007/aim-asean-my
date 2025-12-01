import { Injectable } from '@angular/core';
import { CourseModule } from '../models/course.models';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private modules: CourseModule[] = [
    {
      id: 'module-1',
      title: 'Module 1: Artificial Intelligence (AI) - The Basics and Use Cases',
      description: 'This module will do a quick revision on what Artificial Intelligence is so far. We\'ll explore the different types of AI, such as Machine Learning, Deep Learning, and Generative AI, with practical examples for each. The module also covers the key business reasons for adopting AI, like increasing efficiency, improving customer experience, and gaining a competitive edge. Finally, we\'ll dive into common AI use cases across differentbusiness functions, including customer service, marketing, operations, and finance.',
      duration: '3h 20m',
      thumbnailUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      videos: [
        {
          id: 'intro-angular',
          title: 'Introduction to Angular',
          duration: '10:23',
          youtubeId: '2OHbjep_WjQ',
        },
        {
          id: 'intro-tailwind',
          title: 'Getting Started with Tailwind',
          duration: '12:01',
          youtubeId: 'ft30zcMlFao',
        },
      ],
      isCompulsory:true
    },
    {
      id: 'module-2',
      title: 'Module 2: The AI Adoption Journey - Steps for Business Owners',
      description: 'This module provides a practical, step-by-step roadmap for business owners looking to implement AI. You\'ll learn to define clear business goals and identify opportunities where AI can make the biggest impact. The module guides you through assessing your company\'s data readiness, exploring different solution options (like "buy vs. build"), and developing a small pilot project to test the AI\'s value. The module concludes with a focus on scaling up your AI project and integrating it seamlessly with your existing systems and team.',
      duration: '3h 20m',
      thumbnailUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      videos: [
        {
          id: 'intro-angular',
          title: 'Introduction to Angular',
          duration: '10:23',
          youtubeId: '2OHbjep_WjQ',
        },
        {
          id: 'intro-tailwind',
          title: 'Getting Started with Tailwind',
          duration: '12:01',
          youtubeId: 'ft30zcMlFao',
        },
      ],
      isCompulsory:true
    },
    {
      id: 'module-3',
      title: 'Module 3: Using AI Responsibly - Ethical & Governance Principles',
      description: 'This module is designed to help you understand the important ethical considerations of using AI. It introduces core principles like fairness, transparency, and accountability, with clear examples to illustrate what each one means in a business context. You\'ll learn how to identify and mitigate common risks, such as algorithmic bias and data quality issues. The module also provides a simplified framework for setting up AI governance, helping you establish clear policies and responsibilities for using AI in your organization.',
      duration: '3h 20m',
      thumbnailUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      videos: [
        {
          id: 'intro-angular',
          title: 'Introduction to Angular',
          duration: '10:23',
          youtubeId: '2OHbjep_WjQ',
        },
        {
          id: 'intro-tailwind',
          title: 'Getting Started with Tailwind',
          duration: '12:01',
          youtubeId: 'ft30zcMlFao',
        },
      ],
      isCompulsory:true
    },
    {
      id: 'module-4',
      title: 'Module 4: Key Considerations & Framework for Successful AI Deployment',
      description: 'The final module equips you with a framework to anticipate and handle the broader challenges of AI adoption. We will explore the evolving legal and regulatory landscape and its potential impact on your business. The module addresses how AI changes the workplace, with a focus on upskilling your team and managing the change effectively. You\'ll also learn how to measure the true return on investment (ROI) of your AI projects, considering both short-term and long-term benefits. Finally, the module provides guidance on future-proofing your business by staying updated on AI trends and fostering an AI-ready culture.',
      duration: '3h 20m',
      thumbnailUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      videos: [
        {
          id: 'intro-angular',
          title: 'Introduction to Angular',
          duration: '10:23',
          youtubeId: '2OHbjep_WjQ',
        },
        {
          id: 'intro-tailwind',
          title: 'Getting Started with Tailwind',
          duration: '12:01',
          youtubeId: 'ft30zcMlFao',
        },
      ],
      isCompulsory:true
    },
    {
      id: 'module-5',
      title: 'Module 5: Advanced Data Management & Governance for AI',
      description: 'This module provides a deeper dive into the importance of high-quality data for AI success. It is crucial for businesses that want to move beyond basic AI applications and build more sophisticated, data-driven solutions.',
      duration: '3h 20m',
      thumbnailUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      videos: [
        {
          id: 'intro-angular',
          title: 'Introduction to Angular',
          duration: '10:23',
          youtubeId: '2OHbjep_WjQ',
        },
        {
          id: 'intro-tailwind',
          title: 'Getting Started with Tailwind',
          duration: '12:01',
          youtubeId: 'ft30zcMlFao',
        },
      ],
      isCompulsory:false
    },
    {
      id: 'module-6',
      title: 'Module 6: Building an AI-Ready Culture & Workforce Transformation',
      description: 'This module addresses the human side of AI adoption. It is important for business owners to learn how to prepare their team for AI implementation, manage change effectively, and create a culture that embraces new technology.',
      duration: '3h 20m',
      thumbnailUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      videos: [
        {
          id: 'intro-angular',
          title: 'Introduction to Angular',
          duration: '10:23',
          youtubeId: '2OHbjep_WjQ',
        },
        {
          id: 'intro-tailwind',
          title: 'Getting Started with Tailwind',
          duration: '12:01',
          youtubeId: 'ft30zcMlFao',
        },
      ],
      isCompulsory:false
    },
    {
      id: 'module-7',
      title: 'Module 7: AI Project Risk Management & Mitigation',
      description: 'This module offers an advanced look at identifying and managing the specific risks associated with AI projects. It is essential for business owners who want to minimize potential pitfalls and ensure their AI investments are secure and successful.',
      duration: '3h 20m',
      thumbnailUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      videos: [
        {
          id: 'intro-angular',
          title: 'Introduction to Angular',
          duration: '10:23',
          youtubeId: '2OHbjep_WjQ',
        },
        {
          id: 'intro-tailwind',
          title: 'Getting Started with Tailwind',
          duration: '12:01',
          youtubeId: 'ft30zcMlFao',
        },
      ],
      isCompulsory:false
    },
  ];

  getModules(): CourseModule[] {
    return this.modules;
  }

  getModuleById(id: string): CourseModule | undefined {
    return this.modules.find((m) => m.id === id);
  }
}
