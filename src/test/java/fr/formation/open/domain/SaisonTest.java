package fr.formation.open.domain;

import static org.assertj.core.api.Assertions.assertThat;

import fr.formation.open.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SaisonTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Saison.class);
        Saison saison1 = new Saison();
        saison1.setId(1L);
        Saison saison2 = new Saison();
        saison2.setId(saison1.getId());
        assertThat(saison1).isEqualTo(saison2);
        saison2.setId(2L);
        assertThat(saison1).isNotEqualTo(saison2);
        saison1.setId(null);
        assertThat(saison1).isNotEqualTo(saison2);
    }
}
