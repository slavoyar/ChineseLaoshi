import { isTelegramMiniApp } from '@shared/lib/telegram';
import { useAuthStore } from '@shared/stores';
import { driver, type DriveStep, type Config } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useEffect, useRef } from 'react';

const buildSteps = (): DriveStep[] => {
  const steps: DriveStep[] = [
    {
      element: '[data-tour="brand"]',
      popover: {
        title: 'Home',
        description: 'Tap the logo anytime to return to your vocabulary home screen.',
      },
    },
  ];

  if (!isTelegramMiniApp()) {
    steps.push({
      element: '[data-tour="profile"]',
      popover: {
        title: 'Your profile',
        description: 'See your account name here. Sign out when you are done studying.',
      },
    });
  }

  steps.push(
    {
      element: '[data-tour="create-group"]',
      popover: {
        title: 'Create a group',
        description: 'Organize vocabulary into groups. Open a group to add words and start drills.',
      },
    },
    {
      element: '[data-tour="groups"]',
      popover: {
        title: 'Your groups',
        description: 'Open a group to review cards, add words, and study that deck only.',
      },
    },
    {
      element: '[data-tour="study-modes"]',
      popover: {
        title: 'Study modes',
        description:
          'Pick handwriting, stroke order, pinyin, translation, or mixed practice for all groups.',
      },
    },
  );

  return steps;
};

export const useOnboardingTour = () => {
  const [user, isDemo, isBootstrapped, completeOnboarding] = useAuthStore((state) => [
    state.user,
    state.isDemo,
    state.isBootstrapped,
    state.completeOnboarding,
  ]);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isBootstrapped || isDemo || !user || user.onboardingCompleted || startedRef.current) {
      return;
    }

    const firstTarget = document.querySelector('[data-tour="brand"]');
    if (!firstTarget) {
      return;
    }

    startedRef.current = true;

    const finishTour = () => {
      if (finishedRef.current) {
        return;
      }
      finishedRef.current = true;
      void completeOnboarding().catch(() => {
        finishedRef.current = false;
        startedRef.current = false;
      });
    };

    const finishedRef = { current: false };

    const config: Config = {
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: buildSteps(),
      onDestroyStarted: (_element, _step, { driver: tourDriver }) => {
        finishTour();
        tourDriver.destroy();
      },
    };

    const tourDriver = driver(config);
    const timer = window.setTimeout(() => {
      tourDriver.drive();
    }, 400);

    return () => {
      window.clearTimeout(timer);
      tourDriver.destroy();
    };
  }, [completeOnboarding, isBootstrapped, isDemo, user]);
};
