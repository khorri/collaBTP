CREATE TABLE IF NOT EXISTS `table_gamme_emg` (
  `gamme` int(11) DEFAULT NULL,
  `idproduit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

REPLACE INTO table_gamme_emg SELECT
table_produit_echantillon.IDPRODUIT,
table_produit_echantillon.gamme
FROM
table_produit_echantillon;

CREATE TABLE IF NOT EXISTS `table_gamme_produit` (
  `gamme` int(11) DEFAULT NULL,
  `idproduit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

REPLACE INTO table_gamme_produit SELECT
table_produit.IDPRODUIT,
table_produit.gamme
FROM
table_produit;