package fr.formation.open.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Serie.
 */
@Entity
@Table(name = "serie")
public class Serie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "serie")
    @JsonIgnoreProperties(value = { "episodes", "serie" }, allowSetters = true)
    private Set<Saison> saisons = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Serie id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Serie name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Saison> getSaisons() {
        return this.saisons;
    }

    public void setSaisons(Set<Saison> saisons) {
        if (this.saisons != null) {
            this.saisons.forEach(i -> i.setSerie(null));
        }
        if (saisons != null) {
            saisons.forEach(i -> i.setSerie(this));
        }
        this.saisons = saisons;
    }

    public Serie saisons(Set<Saison> saisons) {
        this.setSaisons(saisons);
        return this;
    }

    public Serie addSaison(Saison saison) {
        this.saisons.add(saison);
        saison.setSerie(this);
        return this;
    }

    public Serie removeSaison(Saison saison) {
        this.saisons.remove(saison);
        saison.setSerie(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Serie)) {
            return false;
        }
        return id != null && id.equals(((Serie) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Serie{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
