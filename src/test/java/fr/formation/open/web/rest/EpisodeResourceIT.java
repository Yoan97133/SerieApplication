package fr.formation.open.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.formation.open.IntegrationTest;
import fr.formation.open.domain.Episode;
import fr.formation.open.repository.EpisodeRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EpisodeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EpisodeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_NUMBER = 1;
    private static final Integer UPDATED_NUMBER = 2;

    private static final String ENTITY_API_URL = "/api/episodes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EpisodeRepository episodeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEpisodeMockMvc;

    private Episode episode;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Episode createEntity(EntityManager em) {
        Episode episode = new Episode().name(DEFAULT_NAME).number(DEFAULT_NUMBER);
        return episode;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Episode createUpdatedEntity(EntityManager em) {
        Episode episode = new Episode().name(UPDATED_NAME).number(UPDATED_NUMBER);
        return episode;
    }

    @BeforeEach
    public void initTest() {
        episode = createEntity(em);
    }

    @Test
    @Transactional
    void createEpisode() throws Exception {
        int databaseSizeBeforeCreate = episodeRepository.findAll().size();
        // Create the Episode
        restEpisodeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(episode)))
            .andExpect(status().isCreated());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeCreate + 1);
        Episode testEpisode = episodeList.get(episodeList.size() - 1);
        assertThat(testEpisode.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEpisode.getNumber()).isEqualTo(DEFAULT_NUMBER);
    }

    @Test
    @Transactional
    void createEpisodeWithExistingId() throws Exception {
        // Create the Episode with an existing ID
        episode.setId(1L);

        int databaseSizeBeforeCreate = episodeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEpisodeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(episode)))
            .andExpect(status().isBadRequest());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEpisodes() throws Exception {
        // Initialize the database
        episodeRepository.saveAndFlush(episode);

        // Get all the episodeList
        restEpisodeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(episode.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)));
    }

    @Test
    @Transactional
    void getEpisode() throws Exception {
        // Initialize the database
        episodeRepository.saveAndFlush(episode);

        // Get the episode
        restEpisodeMockMvc
            .perform(get(ENTITY_API_URL_ID, episode.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(episode.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER));
    }

    @Test
    @Transactional
    void getNonExistingEpisode() throws Exception {
        // Get the episode
        restEpisodeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEpisode() throws Exception {
        // Initialize the database
        episodeRepository.saveAndFlush(episode);

        int databaseSizeBeforeUpdate = episodeRepository.findAll().size();

        // Update the episode
        Episode updatedEpisode = episodeRepository.findById(episode.getId()).get();
        // Disconnect from session so that the updates on updatedEpisode are not directly saved in db
        em.detach(updatedEpisode);
        updatedEpisode.name(UPDATED_NAME).number(UPDATED_NUMBER);

        restEpisodeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEpisode.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEpisode))
            )
            .andExpect(status().isOk());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeUpdate);
        Episode testEpisode = episodeList.get(episodeList.size() - 1);
        assertThat(testEpisode.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEpisode.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    @Transactional
    void putNonExistingEpisode() throws Exception {
        int databaseSizeBeforeUpdate = episodeRepository.findAll().size();
        episode.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEpisodeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, episode.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(episode))
            )
            .andExpect(status().isBadRequest());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEpisode() throws Exception {
        int databaseSizeBeforeUpdate = episodeRepository.findAll().size();
        episode.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEpisodeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(episode))
            )
            .andExpect(status().isBadRequest());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEpisode() throws Exception {
        int databaseSizeBeforeUpdate = episodeRepository.findAll().size();
        episode.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEpisodeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(episode)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEpisodeWithPatch() throws Exception {
        // Initialize the database
        episodeRepository.saveAndFlush(episode);

        int databaseSizeBeforeUpdate = episodeRepository.findAll().size();

        // Update the episode using partial update
        Episode partialUpdatedEpisode = new Episode();
        partialUpdatedEpisode.setId(episode.getId());

        partialUpdatedEpisode.name(UPDATED_NAME);

        restEpisodeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEpisode.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEpisode))
            )
            .andExpect(status().isOk());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeUpdate);
        Episode testEpisode = episodeList.get(episodeList.size() - 1);
        assertThat(testEpisode.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEpisode.getNumber()).isEqualTo(DEFAULT_NUMBER);
    }

    @Test
    @Transactional
    void fullUpdateEpisodeWithPatch() throws Exception {
        // Initialize the database
        episodeRepository.saveAndFlush(episode);

        int databaseSizeBeforeUpdate = episodeRepository.findAll().size();

        // Update the episode using partial update
        Episode partialUpdatedEpisode = new Episode();
        partialUpdatedEpisode.setId(episode.getId());

        partialUpdatedEpisode.name(UPDATED_NAME).number(UPDATED_NUMBER);

        restEpisodeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEpisode.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEpisode))
            )
            .andExpect(status().isOk());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeUpdate);
        Episode testEpisode = episodeList.get(episodeList.size() - 1);
        assertThat(testEpisode.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEpisode.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    @Transactional
    void patchNonExistingEpisode() throws Exception {
        int databaseSizeBeforeUpdate = episodeRepository.findAll().size();
        episode.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEpisodeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, episode.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(episode))
            )
            .andExpect(status().isBadRequest());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEpisode() throws Exception {
        int databaseSizeBeforeUpdate = episodeRepository.findAll().size();
        episode.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEpisodeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(episode))
            )
            .andExpect(status().isBadRequest());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEpisode() throws Exception {
        int databaseSizeBeforeUpdate = episodeRepository.findAll().size();
        episode.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEpisodeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(episode)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Episode in the database
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEpisode() throws Exception {
        // Initialize the database
        episodeRepository.saveAndFlush(episode);

        int databaseSizeBeforeDelete = episodeRepository.findAll().size();

        // Delete the episode
        restEpisodeMockMvc
            .perform(delete(ENTITY_API_URL_ID, episode.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Episode> episodeList = episodeRepository.findAll();
        assertThat(episodeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
