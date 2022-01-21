package fr.formation.open.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Saison.
 */
@Entity
@Table(name = "saison")
public class Saison implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "number")
    private Integer number;

    @OneToMany(mappedBy = "saison")
    @JsonIgnoreProperties(value = { "saison" }, allowSetters = true)
    private Set<Episode> episodes = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "saisons" }, allowSetters = true)
    private Serie serie;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Saison id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumber() {
        return this.number;
    }

    public Saison number(Integer number) {
        this.setNumber(number);
        return this;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Set<Episode> getEpisodes() {
        return this.episodes;
    }

    public void setEpisodes(Set<Episode> episodes) {
        if (this.episodes != null) {
            this.episodes.forEach(i -> i.setSaison(null));
        }
        if (episodes != null) {
            episodes.forEach(i -> i.setSaison(this));
        }
        this.episodes = episodes;
    }

    public Saison episodes(Set<Episode> episodes) {
        this.setEpisodes(episodes);
        return this;
    }

    public Saison addEpisode(Episode episode) {
        this.episodes.add(episode);
        episode.setSaison(this);
        return this;
    }

    public Saison removeEpisode(Episode episode) {
        this.episodes.remove(episode);
        episode.setSaison(null);
        return this;
    }

    public Serie getSerie() {
        return this.serie;
    }

    public void setSerie(Serie serie) {
        this.serie = serie;
    }

    public Saison serie(Serie serie) {
        this.setSerie(serie);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Saison)) {
            return false;
        }
        return id != null && id.equals(((Saison) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Saison{" +
            "id=" + getId() +
            ", number=" + getNumber() +
            "}";
    }
}
