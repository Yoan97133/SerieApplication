package fr.formation.open.repository;

import fr.formation.open.domain.Saison;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Saison entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SaisonRepository extends JpaRepository<Saison, Long> {}
