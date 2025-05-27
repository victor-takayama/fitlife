
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import FaqSection from '../components/features/FaqSection';

const FaqPage: React.FC = () => {
  return (
    <PageWrapper title="Perguntas Frequentes (FAQ)">
      <FaqSection isPage={true} />
    </PageWrapper>
  );
};

export default FaqPage;
    