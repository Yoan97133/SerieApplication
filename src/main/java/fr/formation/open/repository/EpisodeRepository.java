package fr.formation.open.repository;

import fr.formation.open.domain.Episode;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Episode entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EpisodeRepository extends JpaRepository<Episode, Long> {}
