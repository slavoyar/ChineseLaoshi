import 'driver.js/dist/driver.css';

import i18n from '@shared/lib/i18n';
import { isTelegramMiniApp } from '@shared/lib/telegram';
import { useAuthStore } from '@shared/stores';
import { type Config, driver, type DriveStep } from 'driver.js';
import { useEffect, useRef } from 'react';

const buildSteps = (): DriveStep[] => {
  const steps: DriveStep[] = [
    {
      element: '[data-tour="brand"]',
      popover: {
        title: i18n.t('tour.homeTitle'),
        description: i18n.t('tour.homeDescription'),
      },
    },
  ];

  if (!isTelegramMiniApp()) {
    steps.push({
      element: '[data-tour="profile"]',
      popover: {
        title: i18n.t('tour.profileTitle'),
        description: i18n.t('tour.profileDescription'),
      },
    });
  }

  steps.push(
    {
      element: '[data-tour="create-group"]',
      popover: {
        title: i18n.t('tour.createGroupTitle'),
        description: i18n.t('tour.createGroupDescription'),
      },
    },
    {
      element: '[data-tour="groups"]',
      popover: {
        title: i18n.t('tour.groupsTitle'),
        description: i18n.t('tour.groupsDescription'),
      },
    },
    {
      element: '[data-tour="study-modes"]',
      popover: {
        title: i18n.t('tour.studyModesTitle'),
        description: i18n.t('tour.studyModesDescription'),
      },
    }
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
    const finishedRef = { current: false };
    const unmountingRef = { current: false };

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

    const config: Config = {
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: buildSteps(),
      onDestroyStarted: (_element, _step, { driver: tourDriver }) => {
        if (!unmountingRef.current) {
          finishTour();
        }
        tourDriver.destroy();
      },
    };

    const tourDriver = driver(config);
    const timer = window.setTimeout(() => {
      tourDriver.drive();
    }, 400);

    return () => {
      unmountingRef.current = true;
      window.clearTimeout(timer);
      tourDriver.destroy();
    };
  }, [completeOnboarding, isBootstrapped, isDemo, user]);
};
