import MDXComponents from '@theme-original/MDXComponents';
import Termo from '@site/src/components/Termo';

// <Termo> fica disponível em toda página sem import: quem o insere é o plugin
// src/plugins/remark-termos.js, e ele não tem como acrescentar o import.
export default {
  ...MDXComponents,
  Termo,
};
