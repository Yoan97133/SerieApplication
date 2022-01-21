package fr.formation.open.domain;

import static org.assertj.core.api.Assertions.assertThat;

import fr.formation.open.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EpisodeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Episode.class);
        Episode episode1 = new Episode();
        episode1.setId(1L);
        Episode episode2 = new Episode();
        episode2.setId(episode1.getId());
        assertThat(episode1).isEqualTo(episode2);
        episode2.setId(2L);
        assertThat(episode1).isNotEqualTo(episode2);
        episode1.setId(null);
        assertThat(episode1).isNotEqualTo(episode2);
    }
}
