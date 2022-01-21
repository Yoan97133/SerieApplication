package fr.formation.open.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.formation.open.IntegrationTest;
import fr.formation.open.domain.Saison;
import fr.formation.open.repository.SaisonRepository;
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
 * Integration tests for the {@link SaisonResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SaisonResourceIT {

    private static final Integer DEFAULT_NUMBER = 1;
    private static final Integer UPDATED_NUMBER = 2;

    private static final String ENTITY_API_URL = "/api/saisons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SaisonRepository saisonRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSaisonMockMvc;

    private Saison saison;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Saison createEntity(EntityManager em) {
        Saison saison = new Saison().number(DEFAULT_NUMBER);
        return saison;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Saison createUpdatedEntity(EntityManager em) {
        Saison saison = new Saison().number(UPDATED_NUMBER);
        return saison;
    }

    @BeforeEach
    public void initTest() {
        saison = createEntity(em);
    }

    @Test
    @Transactional
    void createSaison() throws Exception {
        int databaseSizeBeforeCreate = saisonRepository.findAll().size();
        // Create the Saison
        restSaisonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(saison)))
            .andExpect(status().isCreated());

        // Validate the Saison in the database
        List<Saison> saisonList = saisonRepository.findAll();
        assertThat(saisonList).hasSize(databaseSizeBeforeCreate + 1);
        Saison testSaison = saisonList.get(saisonList.size() - 1);
        assertThat(testSaison.getNumber()).isEqualTo(DEFAULT_NUMBER);
    }

    @Test
    @Transactional
    void createSaisonWithExistingId() throws Exception {
        // Create the Saison with an existing ID
        saison.setId(1L);

        int databaseSizeBeforeCreate = saisonRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSaisonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(saison)))
            .andExpect(status().isBadRequest());

        // Validate the Saison in the database
        List<Saison> saisonList = saisonRepository.findAll();
        assertThat(saisonList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSaisons() throws Exception {
        // Initialize the database
        saisonRepository.saveAndFlush(saison);

        // Get all the saisonList
        restSaisonMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(saison.getId().intValue())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)));
    }

    @Test
    @Transactional
    void getSaison() throws Exception {
        // Initialize the database
        saisonRepository.saveAndFlush(saison);

        // Get the saison
        restSaisonMockMvc
            .perform(get(ENTITY_API_URL_ID, saison.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(saison.getId().intValue()))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER));
    }

    @Test
    @Transactional
    void getNonExistingSaison() throws Exception {
        // Get the saison
        restSaisonMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSaison() throws Exception {
        // Initialize the database
        saisonRepository.saveAndFlush(saison);

        int databaseSizeBeforeUpdate = saisonRepository.findAll().size();

        // Update the saison
        Saison updatedSaison = saisonRepository.findById(saison.getId()).get();
        // Disconnect from session so that the updates on updatedSaison are not directly saved in db
        em.detach(updatedSaison);
        updatedSaison.number(UPDATED_NUMBER);

        restSaisonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSaison.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSaison))
            )
            .andExpect(status().isOk());

        // Validate the Saison in the database
        List<Saison> saisonList = saisonRepository.findAll();
        assertThat(saisonList).hasSize(databaseSizeBeforeUpdate);
        Saison testSaison = saisonList.get(saisonList.size() - 1);
        assertThat(testSaison.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    @Transactional
    void putNonExistingSaison() throws Exception {
        int databaseSizeBeforeUpdate = saisonRepository.findAll().size();
        saison.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSaisonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, saison.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(saison))
            )
            .andExpect(status().isBadRequest());

        // Validate the Saison in the database
        List<Saison> saisonList = saisonRepository.findAll();
        assertThat(saisonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSaison() throws Exception {
        int databaseSizeBeforeUpdate = saisonRepository.findAll().size();
        saison.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSaisonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(saison))
            )
            .andExpect(status().isBadRequest());

        // Validate the Saison in the database
        List<Saison> saisonList = saisonRepository.findAll();
        assertThat(saisonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSaison() throws Exception {
        int databaseSizeBeforeUpdate = saisonRepository.findAll().size();
        saison.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSaisonMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(saison)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Saison in the database
        List<Saison> saisonList = saisonRepository.findAll();
        assertThat(saisonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSaisonWithPatch() throws Exception {
        // Initialize the database
        saisonRepository.saveAndFlush(saison);

        int databaseSizeBeforeUpdate = saisonRepository.findAll().size();

        // Update the saison using partial update
        Saison partialUpdatedSaison = new Saison();
        partialUpdatedSaison.setId(saison.getId());

        partialUpdatedSaison.number(UPDATED_NUMBER);

        restSaisonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSaison.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSaison))
            )
            .andExpect(status().isOk());

        // Validate the Saison in the database
        List<Saison> saisonList = saisonRepository.findAll();
        assertThat(saisonList).hasSize(databaseSizeBeforeUpdate);
        Saison testSaison = saisonList.get(saisonList.size() - 1);
        assertThat(testSaison.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    @Transactional
    void fullUpdateSaisonWithPatch() throws Exception {
        // Initialize the database
        saisonRepository.saveAndFlush(saison);

        int databaseSizeBeforeUpdate = saisonRepository.findAll().size();

        // Update the saison using partial update
        Saison partialUpdatedSaison = new Saison();
        partialUpdatedSaison.setId(saison.getId());

        partialUpdatedSaison.number(UPDATED_NUMBER);

        restSaisonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSaison.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSaison))
            )
            .andExpect(status().isOk());

        // Validate the Saison in the database
        List<Saison> saisonList = saisonRepository.findAll();
        assertThat(saisonList).hasSize(databaseSizeBeforeUpdate);
        Saison testSaison = saisonList.get(saisonList.size() - 1);
        assertThat(testSaison.getNumber()).isEqualTo(UPDATED_NUMBER);
    }

    @Test
    @Transactional
    void patchNonExistingSaison() throws Exception {
        int databaseSizeBeforeUpdate = saisonRepository.findAll().size();
        saison.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSaisonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, saison.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(saison))
            )
            .andExpect(status().isBadRequest());

        // Validate the Saison in the database
        List<Saison> saisonList = saisonRepository.findAll();
        assertThat(saisonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSaison() throws Exception {
        int databaseSizeBeforeUpdate = saisonRepository.findAll().size();
        saison.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSaisonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(saison))
            )
            .andExpect(status().isBadRequest());

        // Validate the Saison in the database
        List<Saison> saisonList = saisonRepository.findAll();
        assertThat(saisonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSaison() throws Exception {
        int databaseSizeBeforeUpdate = saisonRepository.findAll().size();
        saison.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSaisonMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(saison)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Saison in the database
        List<Saison> saisonList = saisonRepository.findAll();
        assertThat(saisonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSaison() throws Exception {
        // Initialize the database
        saisonRepository.saveAndFlush(saison);

        int databaseSizeBeforeDelete = saisonRepository.findAll().size();

        // Delete the saison
        restSaisonMockMvc
            .perform(delete(ENTITY_API_URL_ID, saison.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Saison> saisonList = saisonRepository.findAll();
        assertThat(saisonList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
