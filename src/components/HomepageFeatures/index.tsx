import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({id: 'homepage.features.openSource.title', message: 'Open Source'}),
    Svg: require('@site/static/img/undraw_open_source.svg').default,
    description: (
      <>
        <Translate id="homepage.features.openSource.description">
          Our goal is to create Open Source projects widely accessible.
        </Translate>
      </>
    ),
  },
  {
    title: translate({id: 'homepage.features.privacy.title', message: 'Privacy Focused'}),
      Svg: require('@site/static/img/undraw_security.svg').default,
      description: (
        <>
          <Translate id="homepage.features.privacy.description">
            We don't collect, track, or store your data. Your privacy is guaranteed by design, not by promise.
          </Translate>
        </>
      )
  },
  {
    title: translate({id: 'homepage.features.community.title', message: 'Community Driven'}),
    Svg: require('@site/static/img/undraw_online_community.svg').default,
    description: (
      <>
        <Translate id="homepage.features.community.description">
          Built by developers, for developers. Your contributions and feedback shape our projects.
        </Translate>
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
