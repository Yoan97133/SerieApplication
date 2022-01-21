package fr.formation.open.web.rest;

import fr.formation.open.domain.Saison;
import fr.formation.open.repository.SaisonRepository;
import fr.formation.open.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.formation.open.domain.Saison}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SaisonResource {

    private final Logger log = LoggerFactory.getLogger(SaisonResource.class);

    private static final String ENTITY_NAME = "saison";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SaisonRepository saisonRepository;

    public SaisonResource(SaisonRepository saisonRepository) {
        this.saisonRepository = saisonRepository;
    }

    /**
     * {@code POST  /saisons} : Create a new saison.
     *
     * @param saison the saison to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new saison, or with status {@code 400 (Bad Request)} if the saison has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/saisons")
    public ResponseEntity<Saison> createSaison(@RequestBody Saison saison) throws URISyntaxException {
        log.debug("REST request to save Saison : {}", saison);
        if (saison.getId() != null) {
            throw new BadRequestAlertException("A new saison cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Saison result = saisonRepository.save(saison);
        return ResponseEntity
            .created(new URI("/api/saisons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /saisons/:id} : Updates an existing saison.
     *
     * @param id the id of the saison to save.
     * @param saison the saison to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated saison,
     * or with status {@code 400 (Bad Request)} if the saison is not valid,
     * or with status {@code 500 (Internal Server Error)} if the saison couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/saisons/{id}")
    public ResponseEntity<Saison> updateSaison(@PathVariable(value = "id", required = false) final Long id, @RequestBody Saison saison)
        throws URISyntaxException {
        log.debug("REST request to update Saison : {}, {}", id, saison);
        if (saison.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, saison.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!saisonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Saison result = saisonRepository.save(saison);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, saison.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /saisons/:id} : Partial updates given fields of an existing saison, field will ignore if it is null
     *
     * @param id the id of the saison to save.
     * @param saison the saison to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated saison,
     * or with status {@code 400 (Bad Request)} if the saison is not valid,
     * or with status {@code 404 (Not Found)} if the saison is not found,
     * or with status {@code 500 (Internal Server Error)} if the saison couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/saisons/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Saison> partialUpdateSaison(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Saison saison
    ) throws URISyntaxException {
        log.debug("REST request to partial update Saison partially : {}, {}", id, saison);
        if (saison.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, saison.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!saisonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Saison> result = saisonRepository
            .findById(saison.getId())
            .map(existingSaison -> {
                if (saison.getNumber() != null) {
                    existingSaison.setNumber(saison.getNumber());
                }

                return existingSaison;
            })
            .map(saisonRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, saison.getId().toString())
        );
    }

    /**
     * {@code GET  /saisons} : get all the saisons.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of saisons in body.
     */
    @GetMapping("/saisons")
    public List<Saison> getAllSaisons() {
        log.debug("REST request to get all Saisons");
        return saisonRepository.findAll();
    }

    /**
     * {@code GET  /saisons/:id} : get the "id" saison.
     *
     * @param id the id of the saison to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the saison, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/saisons/{id}")
    public ResponseEntity<Saison> getSaison(@PathVariable Long id) {
        log.debug("REST request to get Saison : {}", id);
        Optional<Saison> saison = saisonRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(saison);
    }

    /**
     * {@code DELETE  /saisons/:id} : delete the "id" saison.
     *
     * @param id the id of the saison to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/saisons/{id}")
    public ResponseEntity<Void> deleteSaison(@PathVariable Long id) {
        log.debug("REST request to delete Saison : {}", id);
        saisonRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
