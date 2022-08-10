import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useFetchIndustries } from '../../hooks/useFetchIndustries';

import styles from './Industries.module.scss';

const Industries = () => {
  const [query, setQuery] = useState();

  const navigate = useNavigate();

  const { industries, loading } = useFetchIndustries('industries');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (query) {
      return navigate(`/industries/search?q=${query}`)
    }
  };

  const cnpjEdit = (cnpj) => {
    cnpj = cnpj.replace(/\D/g, '');

    if (cnpj.length <= 11) {
      cnpj = cnpj.replace(/(\d{3})(\d)/, '$1.$2');
      cnpj = cnpj.replace(/(\d{3})(\d)/, '$1.$2');
      cnpj = cnpj.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
      cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
      cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
    }

    return cnpj;
  };

  if (loading)
    return (
      <section>
        <p>Carregando ...</p>
      </section>
    );

  return (
    <section className={styles.industries}>
      <h1>Indústrias</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Pesquise por indústrias'
        />
        <input type='submit' value='Buscar' className='btn' />
      </form>

      {!industries && (
        <div className='nopost'>
          <p>Nenhuma indústria cadatrada.</p>
          <button onClick={() => navigate('/industries/new')} className='btn'>
            Cadastrar
          </button>
        </div>
      )}

      {industries && (
        <div>
          <button onClick={() => navigate('/industries/new')} className='btn'>
            Cadastrar
          </button>
          <table className='table'>
            <thead>
              <tr>
                <th>Razão Social</th>
                <th>CNPJ</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {industries &&
                industries.map((industry) => (
                  <tr key={industry.id}>
                    <td>{industry.fantasyName}</td>
                    <td>{cnpjEdit(industry.cnpj)}</td>
                    <td>
                      <Link to={`/industries/${industry.id}`}>Ver</Link>
                      <Link to={`/industries/edit/${industry.id}`}>Editar</Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Industries;
