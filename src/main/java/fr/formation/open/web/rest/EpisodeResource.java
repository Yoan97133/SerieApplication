package fr.formation.open.web.rest;

import fr.formation.open.domain.Episode;
import fr.formation.open.repository.EpisodeRepository;
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
 * REST controller for managing {@link fr.formation.open.domain.Episode}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EpisodeResource {

    private final Logger log = LoggerFactory.getLogger(EpisodeResource.class);

    private static final String ENTITY_NAME = "episode";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EpisodeRepository episodeRepository;

    public EpisodeResource(EpisodeRepository episodeRepository) {
        this.episodeRepository = episodeRepository;
    }

    /**
     * {@code POST  /episodes} : Create a new episode.
     *
     * @param episode the episode to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new episode, or with status {@code 400 (Bad Request)} if the episode has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/episodes")
    public ResponseEntity<Episode> createEpisode(@RequestBody Episode episode) throws URISyntaxException {
        log.debug("REST request to save Episode : {}", episode);
        if (episode.getId() != null) {
            throw new BadRequestAlertException("A new episode cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Episode result = episodeRepository.save(episode);
        return ResponseEntity
            .created(new URI("/api/episodes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /episodes/:id} : Updates an existing episode.
     *
     * @param id the id of the episode to save.
     * @param episode the episode to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated episode,
     * or with status {@code 400 (Bad Request)} if the episode is not valid,
     * or with status {@code 500 (Internal Server Error)} if the episode couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/episodes/{id}")
    public ResponseEntity<Episode> updateEpisode(@PathVariable(value = "id", required = false) final Long id, @RequestBody Episode episode)
        throws URISyntaxException {
        log.debug("REST request to update Episode : {}, {}", id, episode);
        if (episode.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, episode.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!episodeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Episode result = episodeRepository.save(episode);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, episode.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /episodes/:id} : Partial updates given fields of an existing episode, field will ignore if it is null
     *
     * @param id the id of the episode to save.
     * @param episode the episode to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated episode,
     * or with status {@code 400 (Bad Request)} if the episode is not valid,
     * or with status {@code 404 (Not Found)} if the episode is not found,
     * or with status {@code 500 (Internal Server Error)} if the episode couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/episodes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Episode> partialUpdateEpisode(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Episode episode
    ) throws URISyntaxException {
        log.debug("REST request to partial update Episode partially : {}, {}", id, episode);
        if (episode.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, episode.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!episodeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Episode> result = episodeRepository
            .findById(episode.getId())
            .map(existingEpisode -> {
                if (episode.getName() != null) {
                    existingEpisode.setName(episode.getName());
                }
                if (episode.getNumber() != null) {
                    existingEpisode.setNumber(episode.getNumber());
                }

                return existingEpisode;
            })
            .map(episodeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, episode.getId().toString())
        );
    }

    /**
     * {@code GET  /episodes} : get all the episodes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of episodes in body.
     */
    @GetMapping("/episodes")
    public List<Episode> getAllEpisodes() {
        log.debug("REST request to get all Episodes");
        return episodeRepository.findAll();
    }

    /**
     * {@code GET  /episodes/:id} : get the "id" episode.
     *
     * @param id the id of the episode to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the episode, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/episodes/{id}")
    public ResponseEntity<Episode> getEpisode(@PathVariable Long id) {
        log.debug("REST request to get Episode : {}", id);
        Optional<Episode> episode = episodeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(episode);
    }

    /**
     * {@code DELETE  /episodes/:id} : delete the "id" episode.
     *
     * @param id the id of the episode to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/episodes/{id}")
    public ResponseEntity<Void> deleteEpisode(@PathVariable Long id) {
        log.debug("REST request to delete Episode : {}", id);
        episodeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
